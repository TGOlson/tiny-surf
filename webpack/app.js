const path = require('path'); // eslint-disable-line @typescript-eslint/no-var-requires

module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/app/index.tsx'),
  },
  mode: 'development',
  target: 'web',
  devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/assets/js',
  },
  module: { 
    rules: [{
      test: /\.css$/i,
      use: ["style-loader", "css-loader"],
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    fallback: {
      console: false,
    }
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    static: [
      { 
        directory: path.resolve(__dirname, '../public') 
      },
      { 
        directory: path.resolve(__dirname, '../dist'),
        publicPath: '/assets/js',
      },
    ],
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
};
