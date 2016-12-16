var config = require('./webpack.config'),
    webpack = require('webpack'),
    path = require("path"),
    WebpackStrip = require('webpack-strip');

// Output generated files in dist
config.output = {
  path: path.resolve('./dist/'),
  filename: "[hash].js",
};

// Minimize JS
config.plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    compress: {
      warnings: false
    },
    mangle: false,
  })
);

// Remove console.*
config.module.loaders.push({
  test: /\.vue|js$/,
  loader: WebpackStrip.loader('console.info', 'console.log', 'console.debug'),
});

module.exports = config;
