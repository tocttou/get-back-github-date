const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: ["babel-polyfill", "./src/inject-date.js"],
  target: "web",
  output: {
    path: `${__dirname}/dist/bundle`,
    publicPath: "/",
    filename: "bundle.js"
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, "src"),
        loader: "babel-loader"
      }
    ]
  }
};
