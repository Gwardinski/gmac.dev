import * as tailwindPlugin from "prettier-plugin-tailwindcss";

/** Prettier's defaults with a wider line. */
const config = {
  printWidth: 180,
  tabWidth: 2,
};

export default config;

/**
 * Frontends: the base config plus Tailwind class sorting, including inside `cn`, `cva`, `clsx` and `twMerge` calls.
 * `stylesheet` is the project's CSS entry that imports Tailwind, e.g. `./src/App.css`.
 */
export const tailwind = (stylesheet) => ({
  ...config,
  plugins: [tailwindPlugin],
  tailwindStylesheet: stylesheet,
  tailwindFunctions: ["cn", "cva", "clsx", "twMerge"],
});
