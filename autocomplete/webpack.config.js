const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx', // Entry point for your application
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js', // Output bundle file
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // Add .ts and .tsx to resolve array
  },
  module: {
    rules: [
        {
          test: /\.(js|jsx)$/, // Process JavaScript and JSX files
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.(ts|tsx)$/, // Process TypeScript and TSX files
          exclude: /node_modules/,
          use: 'ts-loader',    // Using ts-loader to transpile TypeScript
        },
        {
          test: /\.css$/, // Process CSS files
          use: ['style-loader', 'css-loader'],
        },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // HTML template to use
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 3000, // Dev server port
  },
  mode: 'development', // Development mode
};
