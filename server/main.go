package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
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

func main(){
	var err error
	connStr := "postgresql://user:user@localhost:5432/test?sslmode=disable"
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

	r.GET("/pages/:id", pageByTitle)
	r.POST("/pages", postPage)
	r.Run()
	
}


func pageByTitle(c *gin.Context){

	page, err := getPageByTitle(c.Param("id"))

	if err !=nil {
		c.JSON(http.StatusInternalServerError, gin.H{"err":err})
		fmt.Println(err)
		return
	}


	// c.JSON(http.StatusOK, page)
	c.JSON(http.StatusOK, page)
}

func postPage(c *gin.Context){

	var page Page 
	if err := c.ShouldBindBodyWithJSON(&page); err != nil{
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
	}

	new, err := addPage(page)

	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{"err":err})
		fmt.Println(err)
		return
	}
	
	if new == 0{
		c.JSON(http.StatusInternalServerError, gin.H{"err":err})
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusCreated, new)


}

func getPageByTitle(title string) (Page, error){
	var page Page
	var html string
	
	row := db.QueryRow("SELECT * FROM page WHERE title = $1", title)

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

func addPage(page Page) (int, error){

	prepare := "insert into page (title,source,create_time,update_time) values ($1,$2,current_timestamp,current_timestamp) returning id;"
	id := 0
	err := db.QueryRow(prepare,page.Title,page.Source).Scan(&id);
	if err != nil{
		return 0,fmt.Errorf("addPage: %v", err)
	}
    return id, nil
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

