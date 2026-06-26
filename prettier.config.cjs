const { prettierConfig } = require("@lazy-and-focused/prettier-config");

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  ...prettierConfig,
  singleQuote: false,
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-classnames"],
  overrides: [
    {
      files: "*.html",
      options: {
        parser: "angular",
        printWidth: 70,
      },
    },
  ],
};

module.exports = config;
