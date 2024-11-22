package handlers

import (
	"log/slog"
	"net/http"
	"strconv"
	"wiki/server/models"
	"wiki/server/services"

	"github.com/gin-gonic/gin"
)

// クエリパラメータ "q" でページを全文検索し、
// 検索結果をJSON形式で返す。
//
// 検索結果が取得できない場合は、500エラー(Todo: エラーハンドリング) とエラーメッセージを返す。
// 成功した場合は、検索結果のページのリストをHTTPステータス200で返す。
func PagesBySearchKeyword(c *gin.Context){

	keyword := c.Query("q")
	pages, err := services.GetpagesBySearchKeyword(keyword)

	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{"err":err.Error()})
		createErrorLogger("PagesBySearchKeyword",err,c)
		return
	}

	c.JSON(http.StatusOK, pages)
}

// URLパラメータ "title" に一致するページを取得し、
// そのページの詳細をJSON形式で返す。
// 
// ページが存在しない、またはエラーが発生した場合は、500エラー(Todo: エラーハンドリング) とエラーメッセージを返す。
// 成功した場合は、ページの詳細をHTTPステータス200で返す。
func PageByTitle(c *gin.Context){
	page, err := services.GetPageByTitle(c.Param("title"))

	if err !=nil {
		c.JSON(http.StatusNotFound, gin.H{"err":err.Error()})
		createErrorLogger("PageByTitle",err,c)
		return
	}

	c.JSON(http.StatusOK, page)
}



// 作成日時でソートされたページを最大10件取得し、
// そのページの詳細をJSON形式で返す。
// 
// ページが取得できない場合やエラーが発生した場合は、500エラー(Todo: エラーハンドリング)とエラーメッセージを返す。
// 成功した場合は、ページのリストをHTTPステータス200で返す。
func PagesOrderByCreateTime(c *gin.Context){
	pages, err := services.GetPagesOrderByCreateTime()
	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{"err":err.Error()})
		createErrorLogger("PagesOrderByCreateTime", err, c)
		return
	}
	c.JSON(http.StatusOK, pages)
}

// 新しいページを作成するためのAPIエンドポイント。
// リクエストボディからページ情報を取得し、新しいページを追加する。
// 
// リクエストボディのJSONが不正な場合は、400エラーとエラーメッセージを返す。
// 新しいページの作成が成功した場合は、作成されたページのIDをHTTPステータス201で返す。
// エラーが発生した場合は、500エラーとエラーメッセージを返す。
func PostPage(c *gin.Context){

	var page models.PageCreate 
	if err := c.ShouldBindBodyWithJSON(&page); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		createErrorLogger("PostPage", err, c)
        return
	}
	
	new, err := services.AddPage(page, c)
	
	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{"err":err.Error()})
		createErrorLogger("PostPage", err, c)
		return
	}

	c.JSON(http.StatusCreated, new)
}

// 指定されたページを更新するためのAPIエンドポイント。
// リクエストボディからページ情報を取得し、ページを更新する。
// 
// リクエストボディのJSONが不正な場合は、400エラーとエラーメッセージを返す。
// ページの更新が成功した場合は、更新されたページのIDをHTTPステータス201で返す。
// エラーが発生した場合は、500エラーとエラーメッセージを返す。
func UpdatePage(c *gin.Context){
	var page models.PageUpdate
	if err := c.ShouldBindJSON(&page); err != nil{
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		createErrorLogger("UpdatePage", err, c)
		return
	}
	
	id,err := services.UpdatePageAndPageRevs(page,c)
	
	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{"err":err.Error()})
		createErrorLogger("UpdatePage", err, c)
		return
	}

	c.JSON(http.StatusCreated, id)
}

// 指定されたIDのページを削除するためのAPIエンドポイント。
// URLパラメータからページIDを取得し、そのページを削除する。
// 
// ページIDの解析に失敗した場合は、500エラーとエラーメッセージを返す。
// ページの削除が成功した場合は、HTTPステータス204（No Content）で返す。
// エラーが発生した場合は、500エラーとエラーメッセージを返す。
func DeletePage(c *gin.Context){
	paramId, err := strconv.ParseInt(c.Param("id"),10,32)
	if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"err":err.Error()})
		createErrorLogger("DeletePage", err, c)
		return
    }
	paramId32 := int32(paramId)
	id, err := services.DeletePageAndPageRevs(paramId32,c)
	
	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{"err":err.Error()})
		createErrorLogger("DeletePage", err, c)
		return
	}

	c.JSON(http.StatusNoContent, id)
}

// エラーレベルのログを出力するメソッド
//
// 引数:
//   s: メソッド名
//   e: serviceでのerror
//   c: Ginコンテキスト
func createErrorLogger(s string, e error, c *gin.Context){
	g := slog.Group("request", "method", c.Request.Method, "url", c.Request.URL)
	slog.Error(s, "msg", e.Error(), g)
}