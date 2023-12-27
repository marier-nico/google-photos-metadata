import { defineConfig } from "vite";

export default defineConfig({
  build: {
    manifest: false,
    rollupOptions: {
      input: "./src/main.ts",
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
});
