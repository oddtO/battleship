module.exports = {
  env: {
    browser: true,
    es2021: true,
    // commonjs: true,
  },
  // "\(@[^"/]*\)"
  // eslint-\(plugin\|config\)-\w\+
  extends: ["eslint:recommended", "eslint-config-prettier"],
  plugins: ["eslint-plugin-html", "@html-eslint"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}", "*.config.js", ".stylelintrc.js"],
      parserOptions: {
        sourceType: "script",
      },
    },
    {
      files: ["*.html"],
      parser: "@html-eslint/parser",
      extends: ["plugin:@html-eslint/recommended"],
      rules: { "@html-eslint/require-li-container": "off" },
    },
    {
      files: ["*.test.js"],
      rules: {
        "no-undef": "off",
        "no-unused-vars": "off",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "prefer-const": "error",
  },
};
