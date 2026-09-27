import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],

    // Vitest ma uruchamiać tylko testy unit/integration,
    // a nie testy Playwright E2E.
    include: ["tests/unit/**/*.{test,spec}.{ts,tsx}"],
  },

  resolve: {
    alias: {
      "~": path.resolve(process.cwd(), "./src"),
    },
  },
});