import { defineConfig } from "vite";

export default defineConfig({
  base: "/pixel-cards/",
  build: {
    target: ["es2018", "safari13"],
    polyfillModulePreload: true,
  },
});
