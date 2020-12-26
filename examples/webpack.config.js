const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

function isDirectory(dir) {
  return fs.lstatSync(dir).isDirectory();
}

module.exports = {
  devtool: 'inline-source-map',

  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    const isDraft = dir.charAt(0) === '_';

    if (!isDraft && isDirectory(path.join(__dirname, dir))) {
      entries[dir] = path.join(__dirname, dir, 'Game.js');
    }

    return entries;
  }, {}),

  output: {
    path: 'examples/build',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/build/',
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },

  resolve: {
    alias: {
      flockn: '../../src/index',
    },
  },
};
