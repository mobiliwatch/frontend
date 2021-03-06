var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require("webpack");

var DEBUG = !process.env.NODE_ENV || process.env.NODE_ENV == 'dev';
var BACKEND_URL = DEBUG ? 'http://127.0.0.1:8000' : 'https://mobili.watch';
var API_URL = BACKEND_URL + '/api';
var WS_URL = DEBUG ? 'ws://127.0.0.1:8000' : 'wss://mobili.watch';

module.exports = {
  entry: 'index.js',

  plugins: [
    new ExtractTextPlugin("[hash].css", {allChunks: false}),
    new WebpackCleanupPlugin(),
    new HtmlWebpackPlugin({
      template : 'src/index.html'
    }),
    new webpack.DefinePlugin({
      '__DEBUG__' : DEBUG,
      'BACKEND_URL' : JSON.stringify(BACKEND_URL),
      'API_URL' : JSON.stringify(API_URL),
      'WS_URL' : JSON.stringify(WS_URL),
    }),
  ],

  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "[hash].js"
  },

  devServer: {
    inline: true
  },

  module: {
    loaders: [
      {
        // Load css directly
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      {
        // Support images
        test: /\.(png|jpg|jpeg)$/,
        loader: 'file?name=images/[name].[ext]'
      },
      {
        // Support fonts
        test: /\.(eot|svg|ttf|woff|woff2)/,
        loader: 'file?name=fonts/[name].[ext]'
      },
      {
        // Vue components
        test: /\.vue$/,
        loader: 'vue'
      },
    ]
  },

  resolve: {
    modulesDirectories: ['node_modules', 'bower_components', 'src', 'assets', ],
    extensions: ['', '.js', '.vue', '.css']
  },
};
