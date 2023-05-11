/* 一、不同环境下的打包配置 */
/* 1. 开发环境的配置   下面还有 2. 生产环境的配置 */
const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  // 模式
  mode: 'development',
  // 性能优化 (tree shaking)
  optimization: {
    usedExports: true,
  },
  // source-map
  devtool: 'eval-cheap-module-source-map',
  // 入口文件
  entry: './src/index.js',
  // 开发服务器
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 8080,
    open: true,
    hot: 'only',
  },
  // 输出文件
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    assetModuleFilename: 'assets/[name]_[hash][ext]',
    clean: true,
  },
  // 模块
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
        sideEffects: true,
      },
      // ...
    ],
  },
  // 插件
  plugins: [
    new HTMLWebpackPlugin({
      template: './src/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}

/* 2. 生产环境的配置 */
const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // 模式
  mode: 'production',
  // source-map
  devtool: 'nosources-source-map',
  // 入口文件
  entry: './src/index.js',
  // 输出文件
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    assetModuleFilename: 'assets/[name]_[hash][ext]',
    clean: true,
  },
  // 模块
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
        sideEffects: true,
      },
      // ...
    ],
  },
  // 插件
  plugins: [
    new HTMLWebpackPlugin({
      template: './src/index.html',
    }),
  ],
}

/* 通过观察，我们会发现不同模式下的配置实际上存在了大量的重复代码，那么对于这些重复的代码就需要将它们分离出来共用，提高代码效率。 */

/* 
二、webpack-merge 

这个插件就可以将不同配置合并在一起，也就是可以将共用的配置和不同模式下的配置进行合并，这样就节约了大量的代码书写。
npm i —save-dev webpack-merge

1. 共用配置
新建一个文件 webpack.common.config.js（文件名可以自己起），用于编写共用配置。

2. 开发环境的配置
新建文件：webpack.dev.config.js

3. 生产环境的配置
新建文件：webpack.prod.config.js
*/

/* 
三、package.json 的设置

// package.json
"scripts": {
  "dev": "webpack serve --config ./build/webpack.dev.config.js",
  "build": "webpack --config ./build/webpack.prod.config.js"
}

注意：
1. 一般我们会把两个配置文件放在一个叫做 build 的文件夹中。
2. 配置 dev 和 build 命令时，要看清楚 dev 是需要启动本地服务器的，所以要在 webpack 后面添加 serve；而 build 是生产环境打包，不需要开本地服务器，直接写 webpack 进行打包就行。
3. 记得添加 --config 来自己指定配置文件，同时也要注意文件的路径。
*/

/* 
小结
1. 安装 webpack-merge
2. 在 webpack.common.config.js 中编写共用配置
3. 在 webpack.dev.config.js 中编写开发配置，并利用插件与共用配置合并
4. 在 webpack.prod.config.js 中编写生产配置，并利用插件与共用配置合并
5. 配置完成后，编写 npm 脚本指令
*/
