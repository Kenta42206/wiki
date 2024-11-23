FROM node:22.11-alpine3.20

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとlockファイルをコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# ソースコードをコピー
COPY . .

# ポートを公開
EXPOSE 3000

# アプリケーションの起動
CMD ["npm", "run", "dev", "--", "--host"]