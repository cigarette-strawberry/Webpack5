const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  // ...
  mode: 'development',
  devtool: 'eval-cheap-module-source-map', // development
  devServer: {
    contentBase: path.join(__dirname, 'dist'), // 指定被访问html页面所在目录的路径
    open: true, // 开启服务器时，自动打开页面
    compress: true, // 开启 gzip 压缩
    port: 9000, // 自定义端口号
    // publicPath: '/', // 服务器访问静态资源的默认路径，优先级高于 output.publicPath
  },
  //   在开发环境中， mode devtool devServer 这三个配置是非常重要的！
  output: {
    clean: true, // Clean the output directory before emit.
  },
  plugins: [
    // new CleanWebpackPlugin(), // 在打包之前，清除输入目录下的文件
    new HtmlWebpackPlugin({
      template: './src/index.html', // 这里设置自己模板文件
    }),
  ],
}

/* 
一、Plugins - 快捷打包
如果说，Loader 的作用是将不同的资源进行转换，那么 Plugin 则是在打包的过程中帮我们做一些事情，使打包过程更好管理。

在之前的打包流程中，实际上存在两个问题。
第一，我们是不可以随意删除输出文件夹（我设置的是 dist）下的 index.html 的，打包后的文件以此为 html 模板。
第二，当我们改变输出文件名称时，打包后的新文件与之前没有改名前的旧文件并存。

1) HtmlWebpackPlugin
第一个问题的解决办法就是让 index.html 自动生成。而 HtmlWebpackPlugin 这个插件就是干这个的，它会在打包完成后，在输出目录中自动生成一个 index.html 文件。
在安装插件前，需要在 src 下编写一个 index.html ，以此作为后续打包的模板。
npm install --save-dev html-webpack-plugin

    new HtmlWebpackPlugin({
      template: './src/index.html', // 这里设置自己模板文件
    }),

2) CleanWebpackPlugin
第二个问题的解决办法是在打包之前清除输出目录中的内容，然后让它重新生成。CleanWebpackPlugin 插件虽然不是官方的，但是在 5.20.0 之前的版本中仍然值得推荐。
npm install --save-dev clean-webpack-plugin

    new CleanWebpackPlugin(),

3) output.clean
还有一个更加方便的方法：在 webpack 5.20.0+ 的版本中，内置了清除输出目录内容的功能，只要在 output 选项中配置一个参数即可。

    output: {
      clean: true, // Clean the output directory before emit.
    },

二、Devtool

1. 开发环境中的 source map
module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map' // development
}

2. 生产环境中的 source map
module.exports = {
  mode: 'production',
  devtool: 'nosources-source-map', // production
}

三、DevServer
在开发过程中，我们希望的是自动打包，让我们边写代码边看到修改代码后的效果，而不是每次都手动打包。

官方提供了三种方式：
1.webpack's Watch Mode （监听文件变动，变动则重新打包，输出目录中可以看到新的打包文件。）
2.webpack-dev-server （开启本地开发服务器，默认端口 8080，编译后的文件存在内存中，而非本地。）
3.webpack-dev-middleware （将 webpack 作为 Node.js 的中间件）
这些方式都是不错的开发工具，大部分情况下，用第二种就好。
注意：这些工具仅对开发环境有益，在生产环境中请避免这样的使用！！！

1. watch （监听模式）
在 package.json 中设置脚本。
{
  "scripts": {
    "watch": "webpack --watch", // 监听打包
    "bundle": "webpack" // 普通打包
  },
}
在终端中运行npm run watch，你会发现 webpack 是如何编译你的代码的，在打包完毕后它并不会消失，脚本会持续观察你的文件变化。当你对文件作出修改后，它会自动重新编译发生变化的模块。（也就是说你改了文件内容，它就帮你自动打包。）

2. webpack-dev-server （本地开发服务器）
npm install --save-dev webpack-dev-server

在 package.json 中设置脚本。
{
  "scripts": {
    "start": "webpack serve", // 开启本地服务器
    "watch": "webpack --watch", // 监听打包
    "bundle": "webpack" // 普通打包
  },
}

在 webpack.config.js 中设置脚本。
devServer: {
    contentBase: path.join(__dirname, 'dist'), // 指定被访问html页面所在目录的路径
    open: true, // 开启服务器时，自动打开页面
    compress: true, // 开启 gzip 压缩
    port: 9000, // 自定义端口号
    publicPath: '/' // 服务器访问静态资源的默认路径，优先级高于 output.publicPath
},

webpack-dev-server 在编译后不会在输出目录写入任何文件。相反，它会将打包的文件存在内存中，就好像它们被安装在服务器根路径上的真实文件一样。如果希望在其他路径上找到打包的文件，可以通过使用 devServer 中的 publicPath 选项更改此设置。

3. webpack-dev-middleware （中间件）— 此部分可略过
npm install --save-dev express webpack-dev-middleware

在 package.json 中设置脚本。
{
  "scripts": {
    "server": "node server.js", // 运行 node 服务器
    "start": "webpack serve", // 开启本地服务器
    "watch": "webpack --watch", // 监听打包
    "bundle": "webpack" // 普通打包
  },
}

在 webpack.config.js 中设置脚本。
output: {
    // ...
    publicPath: '/'
}

在根目录下添加一个 server.js
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config')
const compiler = webpack(config); // 打包编译器

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
const app = express();
app.use(webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
}));
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

四、Hot Module Replacement(HMR) - 热模块替换（热更新）
当文件修改重新编译后，页面不要全部刷新，只是响应发生变化的那一部分。这时候就要用到 HMR，热模块替换。
注意：HMR 相当于 dev Server 的辅助，同样只用在开发环境，不要用在生产环境中！！！

+ 在 devServer 配置后，添加 hot 和 hotOnly，意思是开启 HMR
+ 在 plugins 配置后，添加 HMR 插件。（它是 webpack 内置的，记得要在最上面引入一下 webpack）

在 webpack.config.js 中设置脚本。
devServer: {
    contentBase: path.join(__dirname, 'dist'), // 指定被访问html页面所在目录的路径
    // ...
    hot: true, // 开启热更新
    hotOnly: true, // 强制热更新，不会刷新页面
  },
  plugins: [
    // ...
    new webpack.HotModuleReplacementPlugin()
  ],



小结
为了以模板为支撑更有效率地输出打包文件，我们需要 HtmlWebpackPlugin；
为了快速定位代码错误的位置，我们需要 source map；
为了更好地模拟真实环境进行开发，我们需要 devServer（WDS）；
为了实时局部更新修改的内容而非全局更新，我们需要 Hot Module Replacement（HMR）！
*/
