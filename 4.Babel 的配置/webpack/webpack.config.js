module: {
  rules: [
    {
      test: /\.m?js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
      },
    },
  ]
}
/* 
一、babel-loader
有一些版本的浏览器对于JS新的语法(例如 ES6+)的支持不好，这时就需要将新的语法转换成 ES5 标准的语法，让浏览器正常识别它们，保证程序的稳定运行

1. 依赖安装
npm install -D babel-loader @babel/core @babel/preset-env

2. Loader 配置

webpack.config.js
module: {
  rules: [
    {
      test: /\.m?js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }
  ]
}

二、Babel 的配置
对于 babel 的配置，我们一般放在 babel.config.json 中，在根目录中新建 babel.config.json。

1. 一般情况下的 babel 配置

npm i core-js@3 --save

babel.config.json
{
  "presets": [
    ["@babel/preset-env", {
      "useBuiltIns": "usage", // 按需引入 corejs 中的模块 
      "corejs": 3, // 核心 js 版本
      "targets": "> 0.25%, not dead" // 浏览器支持范围
    }]
  ]
}
注意： 必须要配置 useBuiltIns，如果不配置，babel 将不会处理 Promise、Map、Set、Symbol 等全局对象；corejs 也要同时配置，2 的版本可以处理全局对象，但实例方法并不处理，所以这里用 3 的版本。

2. 最佳的 babel 配置
如果在写一个库时，最好添加上插件 —— babel/plugin-transform-runtime
{
  "presets": [
    ["@babel/preset-env", {
      "targets": "> 0.25%, not dead"
    }]
  ],
  "plugins": [
    // 不污染全局，在运行时加载
    ["@babel/plugin-transform-runtime", {
      "corejs": 3
    }]
  ]
}

npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime
npm install --save @babel/runtime-corejs3

三、最后的备注
1. @babel/preset-env just transforms code with syntax, if we don’t config useBuiltIns.
2. @babel/transform-runtime can provide re-use helpers, but don’t polyfill by default.
3. Most situation best config: use @babel/preset-env transforms syntax. use @babel/transform-runtime avoid duplicate code, and config corejs: 3 to polyfill.
*/
