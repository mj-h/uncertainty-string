path = require('path');

module.exports = {
  entry: './src/',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'uncertstr.js',
    library: 'UncertStr',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
    fallback: {
      // util: require.resolve('util/'),
      // assert: require.resolve('assert/'),
    },
  },
  module: {
    rules: [
      // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      { test: /\.tsx?$/, use: ['ts-loader'], exclude: /node_modules/ },
    ],
  },
  mode: 'production',
};
