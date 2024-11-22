package models

import "time"

type Page struct {
	Id         int32     `json:"id"`
	Title      string    `json:"title"`
	Source     string    `json:"source"`
	BodyHtml   string    `json:"bodyHtml"`
	CreateTime time.Time    `json:"createTime"`
	UpdateTime time.Time `json:"updateTime"`
}

type PageCreate struct {
	Title  string `json:"title"`
	Source string `json:"source"`
}

type PageUpdate struct {
	Id     int32  `json:"id"`
	Title  string `json:"title"`
	Source string `json:"source"`
}