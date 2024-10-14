const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack'); 

module.exports = {
  entry: {
    contentScript: './src/contents/contentScript.js',  
    background: './src/background.js',  
    popup: './src/popup/popup.js',
    options: './src/options/options.js',
    sync: './src/sync/sync.js',
    adapters: './src/adapters/adapters.js',
  },
  output: {
    filename: (pathData) => {
      if (pathData.chunk.name === 'popup') {
        return 'popup/[name].js';  
      }else if (pathData.chunk.name === 'options') {
        return 'options/[name].js';  
      }else if (pathData.chunk.name === 'sync') {
        return 'sync/[name].js';  
      }
      return '[name].js';  
    },
    path: path.resolve(__dirname, 'dist'),  
  },
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,  
  plugins: [
    
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },  
        { from: 'src/icons', to: 'icons' },  
        { from: 'src/popup/popup.html', to: 'popup/popup.html' },  
        { from: 'src/popup/popup.css', to: 'popup/popup.css' },  
        { from: 'src/options/options.html', to: 'options/options.html' },  
        { from: 'src/options/options.css', to: 'options/options.css' },  
        { from: 'src/sync/sync.html', to: 'sync/sync.html' },  
        { from: 'src/sync/sync.css', to: 'sync/sync.css' },  
        { from: 'images', to: 'images' },  
      ],
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
};