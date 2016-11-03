'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const proxy = require('./server/webpack-dev-proxy');
const loaders = require('./webpack/loaders');
const styleLintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const baseAppEntries = [
  './src/index.tsx',
];

const devAppEntries = [
  'webpack-hot-middleware/client?reload=true',
];

const appEntries = baseAppEntries
  .concat(process.env.NODE_ENV === 'development' ? devAppEntries : []);

const basePlugins = [
  new webpack.DefinePlugin({
    __DEV__: process.env.NODE_ENV !== 'production',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new webpack.optimize.CommonsChunkPlugin('vendor', '[name].[hash].js'),
  new HtmlWebpackPlugin({
    template: './src/index.ejs',
    inject: false // we inject ourselves in the template
  }),
  new CopyWebpackPlugin([
    { from: "./node_modules/vss-web-extension-sdk/lib/VSS.SDK.min.js", to: "libs/VSS.SDK.min.js" }
    //{ from: "./src/*.html", to: "./" },
    //{ from: "./marketplace", to: "marketplace" },
    //{ from: "./vss-extension.json", to: "vss-extension-release.json" }
  ]),
  new ProgressBarPlugin()
];

const devPlugins = [
  new webpack.NoErrorsPlugin()
];

const prodPlugins = [
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  })
];

const plugins = basePlugins
  .concat(process.env.NODE_ENV === 'production' ? prodPlugins : [])
  .concat(process.env.NODE_ENV === 'development' ? devPlugins : []);

module.exports = {
  target: "web",
  entry: {
    app: appEntries,
    vendor: [
      'es5-shim',
      'es6-shim',
      'es6-promise',
      'react',
      'react-dom',
      'react-router'
    ]
  },

  externals: [
    /^q$/ // /^VSS\/.*/, /^TFS\/.*/, 
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[id].chunk.js',
    libraryTarget: "amd"
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.tsx', '.ts', '.js']
  },

  plugins: plugins,

  devServer: {
    historyApiFallback: { index: '/' },
    proxy: proxy(),
  },

  module: {
    preLoaders: [
      loaders.tslint,
    ],
    loaders: [
      loaders.tsx,
      loaders.html,
      loaders.scss,
      loaders.svg,
      loaders.eot,
      loaders.woff,
      loaders.woff2,
      loaders.ttf,
    ]
  }
};
