package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gomarkdown/markdown"
	"github.com/gomarkdown/markdown/html"
	"github.com/gomarkdown/markdown/parser"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

var db *sql.DB

type Page struct{
	Id int32 `json:"id"`
	Title string `json:"title"`
	Source string `json:"source"`
	BodyHtml string `json:"bodyHtml"`
	CreateTime string `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}

type PageCreate struct{
	Title string `json:"title"`
	Source string `json:"source"`
}

type PageUpdate struct{
	Id int32 `json:"id"`
	Title string `json:"title"`
	Source string `json:"source"`
}

func main(){
	var err error
	connStr := "postgresql://postgres:postgres@localhost:5432/wiki?sslmode=disable"
    db, err = sql.Open("postgres", connStr)
    if err != nil {
		fmt.Println("cannot1");
        log.Fatal(err)
    }
	pingErr := db.Ping()
    if pingErr != nil {
        log.Fatal(pingErr)
    }
    fmt.Println("Connected!")

	r:=gin.Default();

	r.GET("/pages", pagesBySearchKeyword)
	r.GET("/pages/:title", pageByTitle)
	r.POST("/pages", postPage)
	r.PUT("/pages/:id", updatePage)
	r.DELETE("/pages/:id", deletePage)
	r.Run()
	
}

func pagesBySearchKeyword(c *gin.Context){

	keyword := c.Query("q")
	pages, err := getpagesBySearchKeyword(keyword)

	fmt.Println(len(pages))

	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{"err":err.Error()})
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, pages)
}


func pageByTitle(c *gin.Context){

	page, err := getPageByTitle(c.Param("title"))

	

	if err !=nil {
		c.JSON(http.StatusInternalServerError, gin.H{"err":err.Error()})
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, page)
}

func postPage(c *gin.Context){

	var page PageCreate 
	if err := c.ShouldBindBodyWithJSON(&page); err != nil{
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
	}

	new, err := addPage(page, c)

	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{"err":err.Error()})
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusCreated, new)


}

// v1

// func postPage(c *gin.Context){

// 	var page PageCreate 
// 	if err := c.ShouldBindBodyWithJSON(&page); err != nil{
// 		fmt.Println(err)
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
//         return
// 	}

// 	new, err := addPage(page)

// 	if err != nil{
// 		c.JSON(http.StatusInternalServerError, gin.H{"err":err.Error()})
// 		fmt.Println(err)
// 		return
// 	}

// 	c.JSON(http.StatusCreated, new)


// }

func updatePage(c *gin.Context){
	var page PageUpdate
	if err := c.ShouldBindJSON(&page); err != nil{
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id,err := updatePageAndPageRevs(page,c)

	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{"err":err.Error()})
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusCreated, id)
}

func deletePage(c *gin.Context){
	paramId, err := strconv.ParseInt(c.Param("id"),10,32)
	if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"err":err.Error()})
		fmt.Println(err)
		return
    }
	paramId32 := int32(paramId)
	id, err := deletePageAndPageRevs(paramId32,c)

	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{"err":err.Error()})
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusNoContent, id)

}

func getpagesBySearchKeyword(keyword string)([]Page,error){
	var pages []Page
	var html string
	rows, err := db.Query("select * from pages where source &@ $1", keyword)
	if err != nil {
		return nil, fmt.Errorf("pagesBySearchKeyword %s: %v", keyword, err)
	}

	defer rows.Close()

	for rows.Next(){
		var page Page
		if err:=rows.Scan(&page.Id, &page.Title, &page.Source, &page.CreateTime, &page.UpdateTime); err != nil{
			return nil, fmt.Errorf("pagesBySearchKeyword %s: %v", keyword, err)
		}
		md := []byte(page.Source)
		html = string(mdToHTML(md))

		page.BodyHtml = html
		pages = append(pages, page)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("pagesBySearchKeyword %s: %v", keyword, err)
	}
	return pages, nil
}

func getPageByTitle(title string) (Page, error){
	var page Page
	var html string
	
	row := db.QueryRow("SELECT * FROM pages WHERE title = $1", title)

	if err := row.Scan(&page.Id, &page.Title, &page.Source, &page.CreateTime, &page.UpdateTime); err != nil{
		if err == sql.ErrNoRows{
			return page, fmt.Errorf("pageByTitle %s: no such page", title)
		}
		return page, fmt.Errorf("pageByTitle %s: %v", title, err)
	}

	md := []byte(page.Source)
	html = string(mdToHTML(md))

	page.BodyHtml = html

	fmt.Printf("--- Markdown:\n%s\n\n--- HTML:\n%s\n", md, page.BodyHtml)
	

	return page, nil
}

func addPage(page PageCreate, c *gin.Context) (int32, error){

	ctx := c.Request.Context()
	now := time.Now()
	var id int32
	var title string
	var source string

	fail := func(err error) (int32, error) {
        return 0, fmt.Errorf("addPage: %v", err)
    }

	tx,err := db.BeginTx(ctx,nil)

	if err!=nil{
		return fail(err)
	}

	defer tx.Rollback()

	insertPageQuery := "insert into pages (title,source,create_time,update_time) values ($1,$2,$3,$4) returning id, title, source;"
	id = 0
	err = db.QueryRow(insertPageQuery,page.Title,page.Source,now,now).Scan(&id,&title,&source);
	if err != nil{
		return fail(err)
	}

	insertPageRevsQuery := `INSERT INTO page_revs
						(
							page_id, title, source, update_time
						)
						VALUES 
						(
							$1, $2, $3, $4
						);`

	_,err = db.ExecContext(ctx, insertPageRevsQuery, id, title,source,now)
	if err != nil{
		return fail(err)
	}

	if err = tx.Commit(); err != nil {
        return fail(err)
    }

	return id,nil
}

// v1

// func addPage(page PageCreate) (int, error){

// 	prepare := "insert into pages (title,source,create_time,update_time) values ($1,$2,current_timestamp,current_timestamp) returning id;"
// 	id := 0
// 	err := db.QueryRow(prepare,page.Title,page.Source).Scan(&id);
// 	if err != nil{
// 		return 0,fmt.Errorf("addPage: %v", err)
// 	}
//     return id, nil
// }

func updatePageAndPageRevs(page PageUpdate, c *gin.Context) (int32,error){

	ctx := c.Request.Context()

	now := time.Now()

	fail := func(err error) (int32, error) {
        return 0, fmt.Errorf("updatePage: %v", err)
    }
	tx,err := db.BeginTx(ctx,nil)
	if err!=nil{
		return fail(err)
	}
	defer tx.Rollback()

	insertQuery := "insert into page_revs (title, source, update_time, page_id) select title, source, $1, id from pages where id = $2;" 

	_, err = db.ExecContext(ctx, insertQuery, now, page.Id)

	if err != nil {
		return fail(err)
	}
	fmt.Println(page.Source)
	updateQuery := "update pages set title = $1, source = $2, update_time = $3 where id = $4;"

	_, err = db.ExecContext(ctx, updateQuery, page.Title, page.Source, now, page.Id)

	if err != nil {
		return fail(err)
	}

	if err = tx.Commit(); err != nil {
        return fail(err)
    }

	return page.Id,nil

}

func deletePageAndPageRevs(id int32, c *gin.Context)(int32, error){
	ctx := c.Request.Context()

	fail := func(err error) (int32, error) {
        return 0, fmt.Errorf("deletePageAndPageRevs: %v", err)
    }
	tx,err := db.BeginTx(ctx,nil)

	if err!=nil{
		return fail(err)
	}
	defer tx.Rollback()

	deletePageRevsQuery := `delete from page_revs where page_id = $1`

	_, err = db.QueryContext(ctx, deletePageRevsQuery, id)

	if err != nil{
		return fail(err)
	}

	deletePageQuery := `delete from pages where id = $1`
	
	_, err = db.QueryContext(ctx, deletePageQuery, id)

	if err != nil{
		return fail(err)
	}

	if err = tx.Commit(); err != nil {
        return fail(err)
    }

	return id,nil
}



func mdToHTML(md []byte) []byte {
	// create markdown parser with extensions
	extensions := parser.CommonExtensions | parser.AutoHeadingIDs | parser.NoEmptyLineBeforeBlock
	p := parser.NewWithExtensions(extensions)
	doc := p.Parse(md)

	// create HTML renderer with extensions
	htmlFlags := html.CommonFlags | html.HrefTargetBlank
	opts := html.RendererOptions{Flags: htmlFlags}
	renderer := html.NewRenderer(opts)

	return markdown.Render(doc, renderer)
}

