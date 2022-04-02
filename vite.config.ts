import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  alias: {
    tslib: "tslib/tslib.es6.js",
  },
});
