const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  mode: 'development',
  entry: {
    lodash: './src/lodash.js', // 注意顺序，lodash 写在前面
    index: './src/index.js', // 这样 index.js 的代码才能用到 lodash
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },

  //   默认配置
  optimization: {
    splitChunks: {
      chunks: 'async', // 同步 or 异步，这里是异步
      minSize: 20000, // 如果模块大小小于这个值，则不会被分割 20k
      minRemainingSize: 0, // 最小可保存大小，开发模式下为 0，其他情况下等于 minSize，一般不用手动配置
      minChunks: 1, // 如果模块被引用次数小于这个值，则不会被分割
      maxAsyncRequests: 30, // 异步模块，一次最多被加载的次数
      maxInitialRequests: 30, // 入口模块最多被加载的次数
      enforceSizeThreshold: 50000, // 强制分割的大小阈值 50k
      cacheGroups: {
        // 缓存组
        // 打包第三方库
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/, // 正则匹配第三方库文件
          priority: -10, // 优先级
          reuseExistingChunk: true, // 如果一个模块已经被打包过了，那么这个模块也不会被打包
        },
        // 打包公共模块
        default: {
          minChunks: 2, // 被超过两个模块引用，才会被打包
          priority: -20, // 优先级
          reuseExistingChunk: true, // 如果一个模块已经被打包过了，那么这个模块也不会被打包
        },
      },
    },
  },

  //   同步代码
  optimization: {
    splitChunks: {
      chunks: 'all', // 同步或异步
      minSize: 100, // 自己设置最小分割大小
      cacheGroups: {
        // 缓存组
        // 打包第三方库
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/, // 正则匹配第三方库文件
          priority: -10, // 优先级
          reuseExistingChunk: true, // 如果一个模块已经被打包过了，那么这个模块也不会被打包
          filename: 'vendors.js', // 打包后的文件名
        },
        // 打包公共模块
        default: {
          minChunks: 2, // 被超过两个模块引用，才会被打包（可以去掉）
          priority: -20, // 优先级
          reuseExistingChunk: true, // 如果一个模块已经被打包过了，那么这个模块也不会被打包
          filename: 'common.js', // 打包后的文件名
        },
      },
    },
  },
}
/* 
一、前言

// index.js
import _ from 'lodash';
let element = document.createElement('div');
element.innerHTML = _.join(['Hello', 'webpack'], ' ');
document.body.appendChild(element);

观察以上代码，我们发现在开头同步引入了 lodash，这没什么问题，但是一旦这个 index.js 文件很大，只要 index.js 中代码一变化，那么整个 index.js 就会重新加载，这时，lodash 又会被重新引入。简而言之，每次修改 index.js ，就会导致一次 lodash 的引入，这是一种浪费。
*/

/* 
二、Entry 入口配置
将固定复用的代码（以 lodash 为例）写在一个 js 文件中，然后放在 entry 入口配置里。
注意：lodash 和 index 的先后顺序。

// lodash.js
import _ from 'lodash';
window._ = _;

// index.js （主文件）
let element = document.createElement('div');
element.innerHTML = _.join(['Hello', 'webpack'], ' ');
document.body.appendChild(element);

// webpack.config.js
const path = require('path');
module.exports = {
  mode: 'development',
  entry: {
    lodash: './src/lodash.js', // 注意顺序，lodash 写在前面
    index: './src/index.js' // 这样 index.js 的代码才能用到 lodash
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  }
}

这样，main.js 就被拆分为 lodash.js 和 index.js。
+ 当首次加载页面时，lodash.js 被加载一份（1.5MB），index.js 被加载一份（44.2kB）。
+ 当修改业务代码时，只会重新加载 index.js （44.2kB），而 lodash.js 的那一份（1.5MB）则会被浏览器缓存，不会重新加载。
*/

/* 
三、Code Splitting

1. 默认配置
Webpack 提供了代码分离的特性，默认是将 异步代码 按照以下方式进行代码分离的：

2. 同步代码的处理
但显然这对于同步代码是无能为力的，于是我们这样设置：将 optimization.splitChunks.chunks 的值设置为 all ，它表示：不管同步还是异步，都会进行代码分离，但是请注意，如果你的共用模块不属于第三方库（也就是不能在 node_modules 中找到），而属于你自己写的一些代码模块，这些代码就会按照 cacheGroups 下的 default 配置打包。如果属于第三方库，就按照 cacheGroups 下的 defaultVendors 配置打包。

3. 异步代码的处理
回到上面第一项，可以看到对于异步代码，默认就开启对异步代码进行分离。
因此，我们并不需要做什么特殊的处理，它会帮你分离好。
通过动态引入（import()）的代码就是典型的异步代码，它会在打包后生成一个 chunk：
注意：* webpackChunkName: "lodash" * 是一个魔法注释，可以自定义分离文件（chunk）的名称，Chunk 就是被分离的代码。

在一定程度上，动态引入的方式是优于同步引入的，这也就是为什么 webpack 默认对异步代码进行分离的原因。同时，使用异步代码，那么代码利用率也会得到提升。

4. 预获取 / 预加载模块
预获取 prefetch：在浏览器加载完必要的资源后，空闲时就会去获取可能需要的资源。

预加载 preload：预先加载当前页面可能需要的资源，它与必要资源并行请求。

import(* webpackPrefetch: true * './assets/js/click')

5. CSS 的代码分离
CSS 也可以从主文件中分离出来，默认情况下打包后会被添加在 html 的 style 标签中。

如果 CSS 代码有很多行，那么直接嵌入在 html 文件中是不合适的，我们希望它是以 link 标签的形式去插入到 head 标签中，也就是外部引入 CSS 文件的形式。

npm install --save-dev mini-css-extract-plugin
注意：它要配合 css-loader 使用。

// webpack.config.js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
};
注意：除了引入和配置到插件处，还要记得把 'style-loader' 删除，添加为 MiniCssExtractPlugin.loader。



小结
+ 代码分离：将重复代码从打包的最终文件 main.js 中分离出来，避免重复加载，浪费性能。
+ 默认情况下，只对异步代码进行分离，同步代码需要自己手动设置。
+ import() 这种动态引入的语法只要使用了，Webpack 就会帮你分离。
+ 有些不会干扰到全局的异步代码，可以预获取或预加载。
+ CSS 的代码分离：mini-css-extract-plugin
*/
