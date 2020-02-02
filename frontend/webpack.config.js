const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const webpackConfig = {
  entry: {
    bundle: './src/node/resources/js/index.js',
    errorpage: './src/node/resources/js/errorpage.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  watchOptions: {
    ignored: ['node_modules'],
    poll: 1000,
  },
  module: {
    rules: [
      {
        test: /src(\\|\/)node(\\|\/)resources(\\|\/).+\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /src(\\|\/)node(\\|\/)esources(\\|\/).+\.jsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
          'stylelint-custom-processor-loader',
        ],
      },
      {
        test: /src(\\|\/)node(\\|\/)resources(\\|\/)img(\\|\/).+\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[md5:hash].[ext]',
              outputPath: 'img',
              publicPath: 'resources/img',
            },
          },
        ],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, '../backend/src/main/resources/static'),
    filename: '[name].js',
  },
};

if (process.env.NODE_ENV === 'development') {
  webpackConfig.devtool = 'inline-source-map';
}

module.exports = webpackConfig;
