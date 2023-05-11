const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 引入插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
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
  devtool: 'eval-cheap-module-source-map',
  module: {
    noParse: /jquery|lodash/,
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
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          compress: {
            warnings: true,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.table'], // 删除console
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    // 配置插件
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new CleanWebpackPlugin(), // 引入插件
    // 添加插件
    new MiniCssExtractPlugin({
      filename: '[name].[hash:8].css',
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
      generateStatsFile: true, // 是否生成stats.json文件
    }),
    new PurgecssWebpackPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
    new webpack.HotModuleReplacementPlugin(),
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
  /* resolveLoader: {  // 如果你有自定义的 Loader 就需要配置一下 就如下使用
    modules: ['node_modules', resolve('loader')],
  }, */
  // 从输出的 bundle 中排除依赖
  externals: {
    jquery: 'jQuery',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    }, // 静态文件目录
    compress: true, //是否启动压缩 gzip
    port: 8080, // 端口号
    hot: true,
    // open: true, // 是否自动打开浏览器
  },
}

module.exports = (env, argv) => {
  console.log('argv.mode=', argv.mode) // 打印 mode(模式) 值
  // 这里可以通过不同的模式修改 config 配置
  return config
}

/**
 * npm install webpack webpack-cli      npx webpack 进行打包
 *
 * webpack 默认支持处理 JS 与 JSON 文件，其他类型都处理不了，这里必须借助 Loader 来对不同类型的文件的进行处理。
 * Loader 就是将 Webpack 不认识的内容转化为认识的内容
 *    css-loader style-loader sass-loader和node-sass搭配使用
 *
 * 插件（Plugin）可以贯穿 Webpack 打包的生命周期，执行不同的任务
 *    html-webpack-plugin   作用：js 或者 css 文件可以自动引入到 Html 中
 *    clean-webpack-plugin   作用：打包前将打包目录清空
 *
 * cross-env      环境区分
 *
 * webpack-dev-server   作用：启动本地服务 devServer
 *
 * postcss postcss-loader postcss-preset-env      自动添加 CSS3 部分属性的浏览器前缀
 *
 * mini-css-extract-plugin   分离样式文件   通过 CSS 文件的形式引入到页面上  link
 *
 * webpack5 新增资源模块(asset module)，允许使用资源文件（字体，图标等）而无需配置额外的 loader。
 *   1、 asset/resource 将资源分割为单独的文件，并导出 url，类似之前的 file-loader 的功能.
 *   2、 asset/inline 将资源导出为 dataUrl 的形式，类似之前的 url-loader 的小于 limit 参数时功能.
 *   3、 asset/source 将资源导出为源码（source code）. 类似的 raw-loader 功能.
 *   4、 asset 会根据文件大小来选择使用哪种类型，当文件小于 8 KB（默认） 的时候会使用 asset/inline，否则会使用 asset/resource
 *
 * asset/resource 将资源分割为单独的文件，并导出 url，类似之前的 file-loader 的功能.
 * asset/inline 将资源导出为 dataUrl 的形式，类似之前的 url-loader 的小于 limit 参数时功能.
 * asset/source 将资源导出为源码（source code）. 类似的 raw-loader 功能.
 * asset 会根据文件大小来选择使用哪种类型，当文件小于 8 KB（默认） 的时候会使用 asset/inline，否则会使用 asset/resource
 *
 * JS 兼容性（Babel）
 * babel-loader 使用 Babel 加载 ES2015+ 代码并将其转换为 ES5
 * @babel/core Babel 编译的核心包
 * @babel/preset-env Babel 编译的预设，可以理解为 Babel 插件的超集
 * @babel/preset-flow
 * @babel/preset-react
 * @babel/preset-typescript
 * @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties
 *
 * 三种 hash 值
 *    ext：文件后缀名;
 *    name：文件名;
 *    path：文件相对路径;
 *    folder：文件所在文件夹;
 *    hash：任何一个文件改动，整个项目的构建 hash 值都会改变;
 *    chunkhash：文件的改动只会影响其所在 chunk 的 hash 值;
 *    contenthash：每个文件都有单独的 hash 值，文件的改动只会影响自身的 hash 值;
 *
 * thread-loader    worker 多进程
 *
 * webpack-bundle-analyzer   构建结果分析
 *
 * css-minimizer-webpack-plugin   压缩 CSS
 *
 * webpack5 内置了terser-webpack-plugin 插件 不需重复安装，直接引用   压缩 JS
 *    仅适用于source-map，inline-source-map，hidden-source-map和nosources-source-map值的devtool选项。
 *    可移除控制台的 console.log() 和 js代码中的注释
 *
 * purgecss-webpack-plugin   会单独提取 CSS 并清除用不到的 CSS
 *
 * Tree-shaking 作用是剔除没有使用的代码，以降低包的体积
 *
 * splitChunks 分包配置
 *
 * prefetch 与 preload
 *    prefetch (预获取)：浏览器空闲的时候进行资源的拉取
 *    preload (预加载)：提前加载后面会用到的关键资源 ⚠️ 因为会提前拉取资源，如果不是特殊需要，谨慎使用
 *
 */
