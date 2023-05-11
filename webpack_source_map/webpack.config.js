/* module.exports = [
  {
    entry: './src/index.js',
    output: {
      filename: 'a.js',
    },
  },
  {
    entry: './src/index.js',
    output: {
      filename: 'b.js',
    },
  },
] */

const HtmlWebpackPlugin = require('html-webpack-plugin')

// 1）定义不同的打包类型
const allModes = [
  'eval',
  'source-map',
  'eval-source-map',
  'cheap-source-map',
  'inline-source-map',
  'eval-cheap-source-map',
  'cheap-module-source-map',
  'inline-cheap-source-map',
  'eval-cheap-module-source-map',
  'inline-cheap-module-source-map',
  'hidden-source-map',
  'nosources-source-map',
]

// 2）循环不同 SourceMap 模式，生成多个打包入口
module.exports = allModes.map((item) => {
  return {
    devtool: item,
    mode: 'none',
    entry: './src/index.js',
    output: {
      filename: `js/${item}.js`,
    },
    module: {
      rules: [
        {
          test: /.js$/,
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
      // 3）输出到不同的页面
      new HtmlWebpackPlugin({
        filename: `${item}.html`,
      }),
    ],
  }
})

/*
本地开发：

推荐：eval-cheap-module-source-map
理由：

本地开发首次打包慢点没关系，因为 eval 缓存的原因，rebuild 会很快
开发中，我们每行代码不会写的太长，只需要定位到行就行，所以加上 cheap
我们希望能够找到源代码的错误，而不是打包后的，所以需要加上 modele


生产环境：

推荐：(none)
理由：

就是不想别人看到我的源代码
 */
