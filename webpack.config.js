const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode == "production";
  const config = {
    entry: {
      main: "./src/js/index.js",
    },
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "dist"),
      // publicPath: isProduction ? "./" : "auto",
      clean: isProduction,
      environment: {
        arrowFunction: false,
      },
    },

    mode: argv.mode,
    devtool: isProduction ? undefined : "inline-source-map",
    devServer: {
      // static: "./dist",

      watchFiles: ["dist/**/"],
      // watchFiles: [
      //   "src/**/*",
      //   "public/**/*",
      //   "webpack.config.js",
      //   "babel.config.js",
      // ],
      liveReload: true,
      hot: false,
    },
    plugins: [
      new HtmlWebpackPlugin({ template: "./src/html/index.html" }),
      new MiniCssExtractPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.css/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
        {
          test: /\.html$/i,
          loader: "html-loader",
        },

        {
          test: /\.(?:js|mjs|cjs)$/,
          exclude: /node_modules/,

          use: "babel-loader",
        },
      ],
    },
    optimization: {
      minimizer: [`...`, new CssMinimizerWebpackPlugin()],
      minimize: isProduction,
      usedExports: true,
    },
  };

  return config;
};
