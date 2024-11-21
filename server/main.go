package main

import (
	"fmt"
	"log"
	"wiki/server/db"
	"wiki/server/handlers"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	// データベース接続
	err := db.InitDB("postgresql://postgres:postgres@localhost:5432/wiki?sslmode=disable")
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.CloseDB()

	fmt.Println("Connected to database!")

	// ルータ設定
	r := gin.Default()
	r.GET("/pages", handlers.PagesBySearchKeyword)
	r.GET("/pages/title/:title", handlers.PageByTitle)
	r.GET("/pages/recently-created", handlers.PagesOrderByCreateTime)
	r.POST("/pages", handlers.PostPage)
	r.PUT("/pages/:id", handlers.UpdatePage)
	r.DELETE("/pages/:id", handlers.DeletePage)

	r.Run()
}