// webpack 配置文件
const path = require('path') // node.js 的路径模块

module.exports = {
  mode: 'development', // 'development' | 'production'
  // entry: './src/index.js', // 入口文件（简写形式）
  entry: {
    main: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // 打包后的路径
    filename: 'bundle.js', // 打包后的文件名
  },
}

/* 
一、初识 Webpack
1. 介绍
a) webpack
+ 打包 ES Modules，CommonJS 以及 AMD Modules（甚至是组合）。
+ 可以在运行时对异步加载的单文件或多个块进行打包（减少初始加载时间）。
+ 在编译期间解析依赖项，从而减少运行时大小。
+ 加载器（Loaders） 可以在编译时对文件进行预处理。比如，TypeScript to JavaScript, Handlebars strings to compiled functions, images to Base64, etc.
+ 高度模块化的 插件（Plugin） 系统。（Highly modular plugin system）

b) webpack-cli
webpack 官方的 CLI (Command Line Interface) 工具。

2. 安装
npm init -y
npm i webpack webpack-cli --save-dev

webpack 和 webpack-cli 是两个不同的包，--save-dev 可以简写为 -D，表示保存并写进开发依赖中。
注意：webpack-cli 必须安装，否则运行不了 webpack！

查看版本: npx webpack -v 
npx 会自动查找当前依赖包中的可执行文件，如果找不到，就会去 PATH 里找。如果依然找不到，就会帮你安装！

3. 打包
npx webpack-cli      npx webpack

二、Webpack 配置文件 (自定义打包配置)
+ 在根目录下创建配置文件 ( 默认是：webpack.coonfig.js )
+ 编写打包配置项

1. 默认的配置文件
在文件根目录下创建：webpack.config.js

// webpack 配置文件
const path = require('path'); // node.js 的路径模块
module.exports = {
  mode: 'development', // 'development' | 'production'
  // entry: './src/index.js', // 入口文件（简写形式）
  entry: {
    main: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // 打包后的路径
    filename: 'bundle.js', // 打包后的文件名
  }
}
+ 简单的打包配置，配置项包括入口文件、打包路径、打包文件名。
+ 入口文件是指一个项目的主文件，一般来说，所有的模块都会被加入到这个文件中，类似于 vue-cli 中的 main.js 文件。

2. 自定义的配置文件
如果我们并没有将配置文件设置为默认的 webpack.config.js，而是使用了其他的名字，例如：my-webpack-config.js。在这种情况下，我们该如何以这个自定义的配置文件作为配置的标准来打包呢？

npx webpack --config my-webpack-config.js

3. 简化打包流程
以上，我们都是通过手动的 npx webpack 来打包的！
实际上，还可以利用 package.json 中的 scripts 字段来编写运行脚本，通过脚本进行打包。

"scripts": {
  "bundle": "webpack"
},

npm run bundle



小结
为什么会使用 Webpack？模块化、预处理。
Webpack 打包流程：确保存在 package.json 的情况下去打包，注意配置项的设置。
Webpack 的本源：模块打包器，记住是模块。
Webpack 的配置文件：webpack.config.js，配置项：mode/entry/output
简化 Webpack 打包流程：设置 package.json 中的 scripts 字段
*/
