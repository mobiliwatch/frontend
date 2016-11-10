var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: 'index.js',

  plugins: [
    new ExtractTextPlugin("[hash].css", {allChunks: false}),
    new WebpackCleanupPlugin(),
    new HtmlWebpackPlugin({
      title: 'Mobili.Watch',
      template : 'src/index.html'
    })
  ],

  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "[hash].js"
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
        test: /\.(eot|svg|ttf|woff|woff2)$/,
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
    modulesDirectories: ['node_modules', 'bower_components', 'src', ],
    extensions: ['', '.js', '.vue', '.css']
  },
};
