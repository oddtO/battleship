// babel.config.js

module.exports = (api) => {
  const isTest = api.env("test");
  let plugins = [];

  if (isTest) {
    plugins = ["@babel/plugin-transform-modules-commonjs"];
  }

  api.cache.forever();
  // @babel\/[^"]*
  return {
    plugins: plugins,
    presets: [
      [
        "@babel/preset-env",
        {
          useBuiltIns: "entry",
          targets: "defaults",
        },
      ],
    ],
  };
};
