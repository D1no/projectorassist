import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const BROWSER_PORT = 3000;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // TODO: Check if the typing can be fixed.
    // @ts-ignore: Deno seems to not understand the plugins array.
    deno(),
    // @ts-ignore: Deno seems to not understand the plugins array.
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
  publicDir: resolve(__dirname, "../assets/public"),
  resolve: {
    alias: {
      // Needs to be identical to deno.jsonc
      "#lib": resolve(__dirname, "../shared/lib"),
      "#types": resolve(__dirname, "../shared/types"),
      "#assets": resolve(__dirname, "../assets"),
    },
  },
  server: {
    port: BROWSER_PORT,
    strictPort: true,
    host: true,
  },
});
