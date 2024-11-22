package main

import (
	"log/slog"
	"wiki/server/db"
	"wiki/server/handlers"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	// データベース接続
	// dbConf := {
	// 	User: os.Getenv("DB_USER"),
	// }
	err := db.InitDB("postgresql://postgres:postgres@localhost:5432/wiki?sslmode=disable")
	// dbConf := fmt.Sprintf("postgresql://%s:%s@%s:%s/%s?sslmode=disable",
	// 	os.Getenv("DB_USER"),
	// 	os.Getenv("DB_PASSWORD"),
	// 	os.Getenv("DB_HOST"),
	// 	os.Getenv("DB_PORT"),
	// 	os.Getenv("DB_NAME"))
	// err := db.InitDB(dbConf)
	if err != nil {
		slog.Error("Failed to connect to database", "error", err)
	}
	defer db.CloseDB()

	slog.Info("Connected to database!")

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