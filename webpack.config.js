const webpack = require('webpack');
const pkg = require('./package');

module.exports = {
  entry : './src/index.js',
  output : {
    filename : `dist/${pkg.name}.min.js`,
    sourceFilename : '[file].map',
    library: 'Nucleun',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  module : {
    loaders : [{
      test : /\.js?$/,
      exclude : /node_modules/,
      loader : 'babel-loader'
    }],
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        output: {
          comments: false
        },
      }),
    ]
  }
};
