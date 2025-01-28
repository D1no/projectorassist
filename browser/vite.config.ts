import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [deno(), react()],
  publicDir: resolve(__dirname, "../assets/public"),
  resolve: {
    alias: {
      // Needs to be identical to deno.jsonc
      "#lib": resolve(__dirname, "../shared/lib"),
      "#types": resolve(__dirname, "../shared/types"),
      "#assets": resolve(__dirname, "../assets"),
    },
  },
});
