const path = require('path');

module.exports = {
  'mode': 'development',
  'entry': './src/app.js',
  'output': {
    'filename': 'app.js',
    'path': path.resolve(__dirname, 'assets', 'scripts'),
    'publicPath': 'assets/scripts/'
  },
  'devServer': {
    'contentBase': path.join(__dirname, 'dist'),
    'compress': true,
    'port': 9000
  }
};