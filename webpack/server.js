const path = require('path'); // eslint-disable-line @typescript-eslint/no-var-requires

module.exports = {
  entry: path.resolve(__dirname, '../src/server/index.ts'),
  mode: 'development',
  target: 'node',
  devtool: 'inline-source-map',
  output: {
    filename: 'server.bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
};
