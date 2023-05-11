// webpack.config.js
module.exports = {
  // ...
  mode: 'development',
  optimization: {
    usedExports: true,
  },
}
/* 
一、前言

// math.js
const add = (a, b) => a + b;
const minus = (a, b) => a - b;
export {
  add, minus
}

// main.js
const { add } from 'math.js'
console.log(add(1, 2));

我们经常会在主文件或者组件文件中引入其他模块中的代码，但实际上我们只用其中的一部分，剩下的代码则不需要引入。然而在默认情况下，仍然是全部引入并打包的。
这时，为了把多余部分剔除出去，就要用到 “Tree Shaking” 了，也就是摇树。

二、如何理解 Tree Shaking？
（例如上面代码中，math.js 模块中的 minus 就会被摇下来，不参与打包），这样就减轻了代码量，提高性能。

三、哪些引入方式可以使用 Tree Shaking？
首先，要明确一点：Tree Shaking 只支持 ESM 的引入方式，不支持 Common JS 的引入方式。
+ ESM: export + import
+ Common JS: module.exports + require
如果想要对一段代码做 Tree Shaking 处理，那么就要避免引入整个库到一个 JS 对象上，如果你这么做了，Webpack 就会认为你是需要这整个库的，这样就不会做 Tree Shaking 处理。

下面是引入 lodash 的例子，如果引入的是 lodash 中的一部分，则可以 Tree Shaking。
// Import everything (NOT TREE-SHAKABLE)   //导入所有内容（不可树摇动）
import _ from 'lodash';

// Import named export (CAN BE TREE SHAKEN)   //导入命名为导出（可以摇动树）
import { debounce } from 'lodash';

// Import the item directly (CAN BE TREE SHAKEN)   //直接导入项目（可摇动树）
import debounce from 'lodash/lib/debounce';

四、基础配置

1. 开发环境下的配置
// webpack.config.js
module.exports = {
  // ...
  mode: 'development',
  optimization: {
    usedExports: true,
  }
};

2. 生产环境下的配置
// webpack.config.js
module.exports = {
  // ...
  mode: 'production',
};
在生产环境下，Webpack 默认会添加 Tree Shaking 的配置，因此只需写一行 mode: 'production' 即可。

3. sideEffects: false
根据环境的不同进行配置以后，还需要在 package.json 中，添加字段：**sideEffects: false，**告诉 Webpack 哪些代码可以处理。
{
  "name": "webpack-demo-1",
  "sideEffects": false,
  // ...
}

五、sideEffects
+ sideEffects 默认为 true， 告诉 Webpack ，所有文件都有副作用，他们不能被 Tree Shaking。
+ sideEffects 为 false 时，告诉 Webpack ，没有文件是有副作用的，他们都可以 Tree Shaking。
+ sideEffects 为一个数组时，告诉 Webpack ，数组中那些文件不要进行 Tree Shaking，其他的可以 Tree Shaking。

// All files have side effects, and none can be tree-shaken
{
 "sideEffects": true
}

// No files have side effects, all can be tree-shaken
{
 "sideEffects": false
}

// Only these files have side effects, all other files can be tree-shaken, but these must be kept
{
 "sideEffects": [
  "./src/file1.js",
  "./src/file2.js"
 ]
}

六、sideEffects 对全局 CSS 的影响
对于那些直接引入到 js 文件的文件，例如全局的 css，它们并不会被转换成一个 CSS 模块。

  // reset.css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html,
  body {
    background-color: #eaeaea;
  }

  // main.js
import "./styles/reset.css"

这样的代码，在打包后，打开页面，你就会发现样式并没有应用上，原因在于：上面我们将 sideEffects 设置为 false 后，所有的文件都会被 Tree Shaking，通过 import 这样的形式引入的 CSS 就会被当作无用代码处理掉。

为了解决这个问题，可以在 loader 的规则配置中，添加 sideEffects: true ，告诉 Webpack 这些文件不要 Tree Shaking。

// webpack.config.js
module.exports = {
  // ...
    module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
        sideEffects: true
      }
    ]
  },
};
注意：这个字段在所有模块的规则都可以配置。



小结
+ Tree Shaking：摇树
+ import, ESM：摇树的关键
+ optimization, usedExports：开发环境下的基础配置
+ sideEffects：摇树的作用范围
    + package.json 中的配置：sideEffects: false（全都摇）
    + 规则配置中的字段：sideEffects: true（控制全局文件不被摇掉）
*/
