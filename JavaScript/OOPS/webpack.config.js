const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    home: './src/app.js',
    clipboard: './src/clipboard.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'assets', 'scripts'),
    publicPath: 'assets/scripts/'
  },
  devtool: 'cheap-module-eval-source-map',
  // devServer: {
  //   contentBase: "./"
  // }
  plugins: [
    new CleanPlugin.CleanWebpackPlugin(),
  ]
};