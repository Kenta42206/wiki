-- pageテーブル
create table pages(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title varchar(513) unique,
    source text not null,
    create_time timestamp,
    update_time timestamp
);

-- page_revs(更新履歴)テーブル
create table page_revs(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    page_id INTEGER not null,
    title varchar(513) not null,
    source text not null,
    author varchar(513) not null default 'toriaezu@example.com', -- 認証機能未実装のため、とりあえずデフォルトで'toriaezu@example.com'を更新者に設定する
    update_time timestamp
);

-- pgroonga(全文検索用Extension)
CREATE EXTENSION IF NOT EXISTS pgroonga;

-- For dev
SET enable_seqscan = off;

-- 全文検索用インデックス
CREATE INDEX pgroonga_content_index ON pages USING pgroonga (source);
-- 最新10件の取得のためのインデックス
CREATE INDEX idx_pages_create_time ON pages (create_time DESC);

-- テストデータ
INSERT INTO pages(
	title, source, create_time, update_time)
	VALUES ('test1', '# タスク管理アプリ
シンプルで効率的なタスク管理ツールを作ろう。
使いやすさを重視した設計がポイント！', now(), now());

INSERT INTO page_revs(
	title, source, author, update_time, page_id)
	VALUES ('test1', '# タスク管理アプリ
シンプルで効率的なタスク管理ツールを作ろう。
使いやすさを重視した設計がポイント！', 'toriaezu@example.com', now(), 1);

INSERT INTO pages(
	title, source, create_time, update_time)
	VALUES ('test2', '## 学習のコツ
- 小さな目標を立てる
- 毎日コツコツと進める
- 成果を記録して振り返る', now(), now());

INSERT INTO page_revs(
	title, source, author, update_time, page_id)
	VALUES ('test2', '## 学習のコツ
- 小さな目標を立てる
- 毎日コツコツと進める
- 成果を記録して振り返る', 'toriaezu@example.com', now(), 2);

-- INSERT INTO pages(
-- 	title, source, create_time, update_time)
-- 	VALUES ('test3', '# 美味しいコーヒーの淹れ方
-- 1. 豆を適切な粗さに挽く
-- 2. お湯の温度は90〜95度を目安に
-- 3. ゆっくりと均一に注ぐ', now(), now());

-- INSERT INTO pages(
-- 	title, source, create_time, update_time)
-- 	VALUES ('test4', '## 朝のルーチン
-- - 瞑想で心を整える
-- - 軽い運動で体を目覚めさせる
-- - 温かい飲み物を楽しむ', now(), now());

-- INSERT INTO pages(
-- 	title, source, create_time, update_time)
-- 	VALUES ('test6', '# 旅行計画の立て方
-- 1. 行きたい場所をリストアップ
-- 2. 予算と日程を決める
-- 3. 実現可能なプランを作る', now(), now());

