const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'production',
  devtool: 'nosources-source-map',
  entry: './src/index.js',
  externals: ['lodash'], // 忽略 lodash 的打包 (该选项常用于库的开发)
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'library.js',
    clean: true,
    library: {
      name: 'library', // library name
      type: 'umd', // umd, var, this, commonjs, commonjs2, amd, system
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
}
/* 
一、前言
Webpack 除了能够打包项目应用以外，还可以用来打包 JS 库。

当其他人安装了我们的库时，他们可能会在不同的环境中去引入，例如：
import lib from 'lib'; // ESM

const lib = require('lib'); // CommonJS

require(['lib'], function () {}); // AMD
*/

/* 
二、步骤

2.1 库代码

// src/lib/math.js
const add = (a, b) => a + b;
export { add };

// src/lib/string.js
import _ from 'lodash';
const join = (a, b) => {
  return _.join([a, b], ' ');
}
export { join }
注意： 第二个函数用到了外部的库 — lodash。

// src/index.js
import * as math from './lib/math';
import * as string from './lib/string';

export { math, string };

2.2 配置
进入 webpack.config.js 文件，进行一些配置：

1. externals 可以将添加一些你不想要它被打包输出的文件，例如上面的 lodash 是在 string.js 中引入的，可是如果每次都把它打包出去，打包文件的体积就会显得非常臃肿。因此，需要将它添加到 externals 中。
2. output.library 这是专门用于库的设置的，可以设置名称 name 以及 环境类型 type，这个环境类型是指未来当前这个库将以何种方式暴露出去。'var', 'module', 'assign', 'assign-properties', 'this', 'window', 'self', 'global', 'commonjs', 'commonjs2', 'commonjs-module', 'amd', 'amd-require', 'umd', 'umd2', 'jsonp' and 'system'，这里我们设置 'umd' 就可以了，This exposes your library under all the module definitions, allowing it to work with CommonJS, AMD, script tag and as global variable.

2.3 主文件位置设置
最后，进入 package.json：
{
  ...
  "main": "dist/library.js",
  "module": "src/index.js",
  ...
}
main: 以后我们安装了这个库时，引用的位置；
module: 允许升级为 ES2015 模块，而不会破坏向后的兼容性。

2.4 发布到社区



小结
+ 普通的项目文件包和库的包，最大的不同就是：用户可能在不同的环境引入我们的库。
+ 通过配置 output.library.name 来设置名称，通过配置 output.library.type 来设置环境类型。
+ 在设计库文件时，可能用到了外部的库，这时需要通过配置 externals 来设置不需要被打包输出的文件。
+ 在 package.json 中设置主文件位置。
+ 发布到 npm。
*/
