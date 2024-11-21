package utils

import (
	"github.com/gomarkdown/markdown"
	"github.com/gomarkdown/markdown/html"
	"github.com/gomarkdown/markdown/parser"
	"github.com/microcosm-cc/bluemonday"
)

// 渡されたMarkdownデータをHTMLに変換し、サニタイズされた結果を返す。
//
// 引数:
//   md: Markdown形式のバイトスライス。これをHTMLに変換する。
//
// 返り値:
//   HTMLに変換された後、サニタイズされたバイトスライスが返される。
func MdToHTML(md []byte) []byte {
	// create markdown parser with extensions
	extensions := parser.CommonExtensions | parser.AutoHeadingIDs | parser.NoEmptyLineBeforeBlock
	p := parser.NewWithExtensions(extensions)
	doc := p.Parse(md)

	// create HTML renderer with extensions
	htmlFlags := html.CommonFlags | html.HrefTargetBlank
	opts := html.RendererOptions{Flags: htmlFlags}
	renderer := html.NewRenderer(opts)

	rawHTML:= markdown.Render(doc, renderer)

	// sanitize
	policy := bluemonday.UGCPolicy() 
	return policy.SanitizeBytes(rawHTML)
}