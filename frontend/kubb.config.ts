import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";

export default defineConfig({
  root: ".",
  input: {
    path: "http://127.0.0.1:8000/api/v1/openapi.json",
  },
  output: {
    path: "./src/gen",
    clean: true,
  },
  plugins: [pluginOas(), pluginTs(), pluginReactQuery()],
});
