package services

import (
	"database/sql"
	"fmt"
	"time"

	"wiki/server/db"
	"wiki/server/models"
	"wiki/server/utils"

	"github.com/gin-gonic/gin"
)

// 指定された検索キーワードに一致するページを取得し、
// 各ページのMarkdownソースをHTMLに変換した結果を返す。
//
// 引数:
//   keyword: 検索キーワード。ページのソースに対して全文検索を行う。
//
// 返り値:
//   pages: キーワードに一致するページのスライス。
//   error: エラーが発生した場合はエラーを返す。
func GetpagesBySearchKeyword(keyword string)([]models.Page,error){
	var pages []models.Page
	var html string
	rows, err := db.DB.Query("select * from pages where source &@ $1", keyword)
	if err != nil {
		return nil, fmt.Errorf("pagesBySearchKeyword %s: %v", keyword, err)
	}

	defer rows.Close()

	for rows.Next(){
		var page models.Page
		if err:=rows.Scan(&page.Id, &page.Title, &page.Source, &page.CreateTime, &page.UpdateTime); err != nil{
			return nil, fmt.Errorf("pagesBySearchKeyword %s: %v", keyword, err)
		}
		md := []byte(page.Source)
		html = string(utils.MdToHTML(md))

		page.BodyHtml = html
		pages = append(pages, page)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("pagesBySearchKeyword %s: %v", keyword, err)
	}
	return pages, nil
}

// 指定されたタイトルに一致するページを取得し、
// そのページのMarkdownソースをHTMLに変換した結果を返す。
// 
// 引数:
//   title: 取得するページのタイトル。
// 
// 返り値:
//   page: タイトルに一致するページ。
//   error: エラーが発生した場合はエラーを返す。
//   該当ページが存在しない場合は、「no such page」というエラーメッセージを返す。
func GetPageByTitle(title string) (models.Page, error){
	var page models.Page
	var html string
	
	row := db.DB.QueryRow("SELECT * FROM pages WHERE title = $1", title)

	if err := row.Scan(&page.Id, &page.Title, &page.Source, &page.CreateTime, &page.UpdateTime); err != nil{
		if err == sql.ErrNoRows{
			return page, fmt.Errorf("pageByTitle %s: no such page", title)
		}
		return page, fmt.Errorf("pageByTitle %s: %v", title, err)
	}


	md := []byte(page.Source)
	html = string(utils.MdToHTML(md))

	page.BodyHtml = html
	

	return page, nil
}

// 作成日時でソートされたページを最大10件取得し、
// 各ページのMarkdownソースをHTMLに変換した結果を返す。
// 
// 返り値:
//   pages: 作成日時順でソートされたページのスライス。
//   error: エラーが発生した場合はエラーを返す。
func GetPagesOrderByCreateTime()([]models.Page, error){
	var pages []models.Page
	var html string
	
	rows, err := db.DB.Query("select * from pages order by create_time desc limit 10;")
	if err!= nil{
		return nil, fmt.Errorf("getPagesOrderByUpdateTime : %v", err)
	}

	defer rows.Close()

	for rows.Next(){
		var page models.Page
		if err:=rows.Scan(&page.Id, &page.Title, &page.Source, &page.CreateTime, &page.UpdateTime); err != nil{
			return nil, fmt.Errorf("getPagesOrderByUpdateTime : %v", err)
		}
		md := []byte(page.Source)
		html = string(utils.MdToHTML(md))

		page.BodyHtml = html
		pages = append(pages, page)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("getPagesOrderByUpdateTime : %v", err)
	}
	return pages, nil
}

// 新しいページをデータベースに追加し、
// 新しいページのIDを返す。
// 
// 引数:
//   page: 追加するページの情報
//   c: Ginコンテキスト。トランザクションに使用される。
// 
// 返り値:
//   id: 追加されたページのID。
//   error: エラーが発生した場合はエラーを返す。
func AddPage(page models.PageCreate, c *gin.Context) (int32, error){

	ctx := c.Request.Context()
	now := time.Now()
	var id int32
	var title string
	var source string

	fail := func(err error) (int32, error) {
        return 0, fmt.Errorf("addPage: %v", err)
    }

	tx,err := db.DB.BeginTx(ctx,nil)

	if err!=nil{
		return fail(err)
	}

	defer tx.Rollback()

	insertPageQuery := "insert into pages (title,source,create_time,update_time) values ($1,$2,$3,$4) returning id, title, source;"
	id = 0
	err = db.DB.QueryRow(insertPageQuery,page.Title,page.Source,now,now).Scan(&id,&title,&source);
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

	_,err = db.DB.ExecContext(ctx, insertPageRevsQuery, id, title,source,now)
	if err != nil{
		return fail(err)
	}

	if err = tx.Commit(); err != nil {
        return fail(err)
    }

	return id,nil
}

// 指定されたページを更新し、その履歴も更新する。
// 
// 引数:
//   page: 更新するページの情報（ID、Title、Source）
//   c: Ginコンテキスト。トランザクションに使用される。
// 
// 返り値:
//   id: 更新されたページのID。
//   error: エラーが発生した場合はエラーを返す。
func UpdatePageAndPageRevs(page models.PageUpdate, c *gin.Context) (int32,error){

	ctx := c.Request.Context()

	now := time.Now()

	fail := func(err error) (int32, error) {
        return 0, fmt.Errorf("updatePage: %v", err)
    }
	tx,err := db.DB.BeginTx(ctx,nil)
	if err!=nil{
		return fail(err)
	}
	defer tx.Rollback()

	insertQuery := "insert into page_revs (title, source, update_time, page_id) select title, source, $1, id from pages where id = $2;" 

	_, err = db.DB.ExecContext(ctx, insertQuery, now, page.Id)

	if err != nil {
		return fail(err)
	}

	updateQuery := "update pages set title = $1, source = $2, update_time = $3 where id = $4;"

	_, err = db.DB.ExecContext(ctx, updateQuery, page.Title, page.Source, now, page.Id)

	if err != nil {
		return fail(err)
	}

	if err = tx.Commit(); err != nil {
        return fail(err)
    }

	return page.Id,nil

}

// 指定されたIDのページとその履歴を削除する。
// 
// 引数:
//   id: 削除するページのID。
//   c: Ginコンテキスト。トランザクションに使用される。
// 
// 返り値:
//   id: 削除されたページのID。
//   error: エラーが発生した場合はエラーを返す。
func DeletePageAndPageRevs(id int32, c *gin.Context)(int32, error){
	ctx := c.Request.Context()

	fail := func(err error) (int32, error) {
        return 0, fmt.Errorf("deletePageAndPageRevs: %v", err)
    }
	tx,err := db.DB.BeginTx(ctx,nil)

	if err!=nil{
		return fail(err)
	}
	defer tx.Rollback()

	deletePageRevsQuery := `delete from page_revs where page_id = $1`

	_, err = db.DB.QueryContext(ctx, deletePageRevsQuery, id)

	if err != nil{
		return fail(err)
	}

	deletePageQuery := `delete from pages where id = $1`
	
	_, err = db.DB.QueryContext(ctx, deletePageQuery, id)

	if err != nil{
		return fail(err)
	}

	if err = tx.Commit(); err != nil {
        return fail(err)
    }

	return id,nil
}