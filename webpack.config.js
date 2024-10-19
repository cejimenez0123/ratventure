const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  devServer: {
    static: './dist', // Directory to serve
    port: 3000, // Port to listen on
    open: true, // Automatically open the browser
    hot: true, // Enable hot module replacement
  },
  entry: './src/index.js', // Your main JavaScript entry point
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, 
        loader: 'url-loader',
        options: {
          name: '[name].[hash].[ext]',
          outputPath: 'images',
        },
      },

    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // Your HTML template
      filename: 'index.html',
    }),
  ],
};