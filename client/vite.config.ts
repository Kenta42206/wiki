import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://server:8080", // バックエンドサーバーのURL(ローカルで動かす場合はhttp://localhost:8080にする)
        changeOrigin: true, // Originをバックエンドに合わせる
        rewrite: (path) => path.replace(/^\/api/, ""), // '/api'を削除してバックエンドに送る
      },
    },
  },
});
