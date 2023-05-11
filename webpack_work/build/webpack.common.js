const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 引入插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin')
const glob = require('glob') // 文件匹配模式

console.log('process.env.NODE_ENV=', process.env.NODE_ENV) // 打印环境变量

// 路径处理方法
function resolve(dir) {
  return path.join(__dirname, dir)
}

const PATHS = {
  src: resolve('src'),
}

const config = {
  entry: './src/index.js', // 打包入口地址
  output: {
    filename: 'bundle.js', // 输出文件名
    path: path.join(__dirname, 'dist'), // 输出文件目录
  },
  //   devtool: 'eval-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/i,
        include: resolve('src'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
          {
            loader: 'thread-loader', // 开启多进程打包
            options: {
              worker: 3,
            },
          },
        ],
      },
      {
        test: /\.(s[ac]|c)ss$/i, // 匹配所有的 sass/scss/css 文件
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader, // 添加 loader
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ], // use: 对应的 Loader 名称
      },
      {
        test: /\.(jpe?g|png|gif)$/i, // 匹配图片文件
        type: 'asset', // 一般会转换为 "asset/resource"
        generator: {
          filename: '[name]_[hash][ext]', // 输出文件位置以及文件名
        },
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb （低于8kb都会压缩成 base64）
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 匹配字体文件
        type: 'asset', // 一般会转换为 "asset/inline"
        generator: {
          filename: '[name]_[hash][ext]', // 输出文件位置以及文件名
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 8kb 超过10kb不转 base64
          },
        },
      },
    ],
  },
  plugins: [
    // 配置插件
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new PurgecssWebpackPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
  ],
  resolve: {
    // 配置别名
    alias: {
      '~': resolve('src'),
      '@': resolve('src'),
      components: resolve('src/components'),
    },
    // 引入模块时不带扩展名
    extensions: ['.ts', '...'],
    // 告诉 webpack 解析模块时应该搜索的目录
    modules: [resolve('src'), 'node_modules'],
  },
}

module.exports = (env, argv) => {
  console.log('argv.mode=', argv.mode) // 打印 mode(模式) 值
  // 这里可以通过不同的模式修改 config 配置
  return config
}
