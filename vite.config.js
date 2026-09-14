// vite.config.js
import { defineConfig } from "vite";
import apiMiddleware from "./server/server.js";

export default defineConfig({
  plugins: [apiMiddleware()],
  server: {
    port: 3000,
  },
  root: ".",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
