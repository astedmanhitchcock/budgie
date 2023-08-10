import path from 'path';
import webpack from 'webpack';
import dotenv from 'dotenv';
import fs from 'fs';
import HTMLWebpackPlugin from 'html-webpack-plugin';
//create css file per js file: https://webpack.kr/plugins/mini-css-extract-plugin/
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Get the root path (assuming your webpack config is in the root of your project!)
const currentPath = path.join(__dirname);
// Create the fallback path (the production .env)
const basePath = currentPath + '/.env';
// We're concatenating the environment name to our filename to specify the correct env file!
const devPath = basePath + '.' + 'development';
// Check if the file exists, otherwise fall back to the production .env
const finalPath = isDevelopment ? devPath : basePath;
// Set the path parameter in the dotenv config
const fileEnv = dotenv.config({ path: finalPath }).parsed;
// reduce it to a nice object, the same as before (but with the variables from the file)
const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
  return prev;
}, {});

// define plugins
const plugins: webpack.WebpackPluginInstance[] = [
  new webpack.DefinePlugin(envKeys),
  new HTMLWebpackPlugin({
    template: './public/index.html', // you have to have the template file
  }),
];
isDevelopment
  ? plugins.push(new ReactRefreshWebpackPlugin())
  : plugins.push(new MiniCssExtractPlugin());


const config: webpack.Configuration = {
  mode: isDevelopment ? 'development' : 'production',
  devServer: {
    hot: true,
    port: 3000,
    historyApiFallback: true
  },
  entry: './src/index.tsx', // codes will be inside src folder
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    publicPath: '/'
    // more configurations: https://webpack.js.org/configuration/
  },
  plugins,
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    // automatically resolve certain extensions (Ex. import './file' will automatically look for file.js)
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css'],
    alias: {
      // absolute path importing files
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [
                isDevelopment && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/i, // .sass or .scss
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // for Tailwind CSS
          'postcss-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },
};

export default config;