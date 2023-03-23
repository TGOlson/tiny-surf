const { merge } = require('webpack-merge'); // eslint-disable-line @typescript-eslint/no-var-requires
const appDev = require('./app.js'); // eslint-disable-line @typescript-eslint/no-var-requires

module.exports = merge(appDev, {
  mode: 'production',
  devtool: 'source-map',
});
