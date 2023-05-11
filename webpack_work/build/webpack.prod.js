const { merge } = require('webpack-merge') // 插件引入
const commonConfig = require('./webpack.common') // 引入共用配置

const prodConfig = {
  devtool: 'none',
}

module.exports = merge(commonConfig, prodConfig) // 共用配置与生产配置合并
