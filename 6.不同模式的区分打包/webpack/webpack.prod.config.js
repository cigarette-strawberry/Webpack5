const { merge } = require('webpack-merge') // 插件引入
const commonConfig = require('./webpack.common.config') // 引入共用配置

const prodConfig = {
  mode: 'production',
  devtool: 'nosources-source-map',
}

module.exports = merge(commonConfig, prodConfig) // 共用配置与生产配置合并
