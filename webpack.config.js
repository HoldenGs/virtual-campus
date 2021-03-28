const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

const config = {
  devtool: 'eval-source-map',
  target: 'web',
  entry: './client/index.js',
  watch: true,
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    filename: 'index.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new HtmlWebpackPlugin({ template: './client/index.html' })
  ]
}

module.exports = config