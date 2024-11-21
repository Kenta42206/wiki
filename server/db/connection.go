package db

import (
	"database/sql"
	"fmt"
)

var DB *sql.DB

// データベース初期化
func InitDB(connStr string) error {
	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		return fmt.Errorf("failed to open database: %v", err)
	}

	if err := DB.Ping(); err != nil {
		return fmt.Errorf("failed to ping database: %v", err)
	}
	return nil
}

// データベースクローズ
func CloseDB() {
	if DB != nil {
		DB.Close()
	}
}