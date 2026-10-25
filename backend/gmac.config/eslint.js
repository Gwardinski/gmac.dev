import js from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import prettier from "eslint-config-prettier/flat";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

const ignores = globalIgnores(["**/dist/", "**/build/", "**/coverage/", "**/routeTree.gen.ts"]);

/** TypeScript without React: backends and scripts. */
export const base = [
  ignores,
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { languageOptions: { globals: globals.node } },
  // Last, so formatting is left to Prettier
  prettier,
];

/** React + Vite frontends using TanStack Query. */
export const react = [
  ignores,
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  ...pluginQuery.configs["flat/recommended"],
  { languageOptions: { globals: globals.browser } },
  {
    // gmac.ui exports cva variants and option lists alongside its components
    files: ["**/components/gmac.ui/**"],
    rules: { "react-refresh/only-export-components": "off" },
  },
  {
    // TanStack Router file routes export only `Route` and define their components locally; the router's Vite plugin handles their HMR
    files: ["**/routes/**"],
    rules: { "react-refresh/only-export-components": "off" },
  },
  prettier,
];
