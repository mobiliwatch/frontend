var config = require('./webpack.config'),
    webpack = require('webpack'),
    path = require("path");

// Output generated files in dist
config.output = {
  path: path.resolve('./dist/'),
  filename: "[hash].js",
};

// Minimize JS
config.plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    minimize: true
  })
);

module.exports = config;
