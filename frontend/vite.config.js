import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import eslintPlugin from "vite-plugin-eslint";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [vue(), eslintPlugin()],
  test: {
    globals: true,
    environment: "happy-dom",
  },
});
