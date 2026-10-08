import { copyFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
  resolve:
    mode === "production"
      ? {
          alias: [
            {
              find: "react/jsx-dev-runtime",
              replacement: path.resolve(root, "node_modules/react/cjs/react-jsx-dev-runtime.production.js"),
            },
            {
              find: "react/jsx-runtime",
              replacement: path.resolve(root, "node_modules/react/cjs/react-jsx-runtime.production.js"),
            },
            {
              find: "react-dom/client",
              replacement: path.resolve(root, "node_modules/react-dom/cjs/react-dom-client.production.js"),
            },
            {
              find: /^react-dom$/,
              replacement: path.resolve(root, "node_modules/react-dom/cjs/react-dom.production.js"),
            },
            {
              find: /^react$/,
              replacement: path.resolve(root, "node_modules/react/cjs/react.production.js"),
            },
          ],
        }
      : undefined,
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "github-pages-spa-fallback",
      apply: "build",
      closeBundle() {
        copyFileSync("dist/index.html", "dist/404.html");
      },
    },
  ],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
}));
