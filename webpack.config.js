// const webpack = require('webpack');
import path from 'path';
// const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const BUILD_DIR = path.resolve('dist');
const APP_DIR = path.resolve('src');
const config = {
  mode: 'development',
  entry: [
    // './src/server/commonimports.js',
    './express-server.js',
    // './src/server/test.js'
  ],
  // output: {
  //   path: BUILD_DIR,
  //   filename: 'commonimports.js'
  // },
  // output: {
  //   path: 'C:\\Users\\samarjit.samanta\\Desktop\\test\\dist', // path.resolve(__dirname, 'dist'),
  //   filename: '[name].js',
  //   library: 'vendor',
  //   libraryTarget: 'umd',
  //   // library: 'vendor',
  //   // libraryTarget: 'var',
  //   // libraryExport: 'default',
  //   // pathinfo: true
  // },
  devServer: {
    hot: true,
    static: ['public'] // serve data from these folders
  },
  module: {
    rules: [{
      test: /\.jsx?/, //if there is any file inside src folder with etension .jsx or .js, then webpack will load the file using babel loader         
      include: APP_DIR,
      loader: 'babel-loader',
      // options: { presets: [['@babel/preset-env', { targets: 'defaults' }], ['@babel/preset-react']] }
    }]
  },
  plugins: [
    // new NodePolyfillPlugin()
  ],
  // resolve: {
  //   fallback: {
  //     fs: false,
  //     tls: false,
  //     net: false,
  //     path: false,
  //     zlib: false,
  //     http: false,
  //     https: false,
  //     stream: false,
  //     crypto: false,
  //     async_hooks: false,
  //     'crypto-browserify': false, // require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
  //   } 
  // }
  target: 'node'
};
export default config;
