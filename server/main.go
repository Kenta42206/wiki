package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

var db *sql.DB

type Page struct{
	Id int32 `json:"id"`
	Title string `json:"title"`
	Source string `json:"source"`
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
	
	row := db.QueryRow("SELECT * FROM page WHERE title = $1", title)

	if err := row.Scan(&page.Id, &page.Title, &page.Source, &page.CreateTime, &page.UpdateTime); err != nil{
		if err == sql.ErrNoRows{
			return page, fmt.Errorf("pageByTitle %s: no such page", title)
		}
		return page, fmt.Errorf("pageByTitle %s: %v", title, err)
	}
	return page, nil
}

func addPage(page Page) (int, error){
	fmt.Printf("title %s",page.Title)
	fmt.Printf("source %s",page.Source)

	prepare := "insert into page (title,source,create_time,update_time) values ($1,$2,current_timestamp,current_timestamp) returning id;"
	id := 0
	err := db.QueryRow(prepare,page.Title,page.Source).Scan(&id);
	if err != nil{
		return 0,fmt.Errorf("addPage: %v", err)
	}
    return id, nil
}

