import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

// Config de teste isolada (não altera o build do app — vite.config.ts segue intacto).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["src/core/**/*.{ts,tsx}"],
      exclude: ["src/**/*.{test,spec}.{ts,tsx}", "src/test/**"],
    },
  },
});
