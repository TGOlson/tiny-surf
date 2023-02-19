const path = require('path'); // eslint-disable-line @typescript-eslint/no-var-requires

module.exports = {
  entry: {
    server: path.resolve(__dirname, '../src/server/index.ts'),
  },
  mode: 'development',
  target: 'node',
  devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  externals: [{ "express": "require('express')" }]
};
