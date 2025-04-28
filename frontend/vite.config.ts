import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const BACKEND_URL = "http://127.0.0.1:8000";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "127.0.0.1",
    proxy: {
      "/api/": {
        // setting origin in headers is important
        // becuase it returns csrf failed (does not trust the origin error)
        target: BACKEND_URL,
        changeOrigin: true,
        headers: {
          origin: BACKEND_URL,
        },
      },
      "/admin/": {
        // same configuration as /api/
        target: BACKEND_URL,
        changeOrigin: true,
        headers: {
          origin: BACKEND_URL,
        },
      },
      "/static/": {
        // setting origin header is not required because
        // static urls are all GET and does not use csrftoken
        changeOrigin: true,
        target: BACKEND_URL,
      },
    },
  },
});
