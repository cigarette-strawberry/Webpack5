// webpack.dev.config.js
const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge') // 插件引入
const commonConfig = require('./webpack.common.config') // 引入共用配置

const devConfig = {
  // 模式
  mode: 'development',
  // 性能优化 (tree shaking)
  optimization: {
    usedExports: true,
  },
  // source-map
  devtool: 'eval-cheap-module-source-map',
  // 开发服务器
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 8080,
    open: true,
    hot: true, // 代码变化后，自动刷新页面 (该参数可以不用手动添加，它已经被自动应用于 HMR 插件。)
  },
  // 插件
  plugins: [new webpack.HotModuleReplacementPlugin()],
}

module.exports = merge(commonConfig, devConfig) // 共用配置与开发配置合并
