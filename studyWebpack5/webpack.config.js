const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') // js 或者 css 文件可以自动引入到 Html 中
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 打包输出前清空文件夹
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 拆分css
const vueLoaderPlugin = require('vue-loader/lib/plugin')
const Webpack = require('webpack')
const devMode = process.argv.indexOf('--mode=production') === -1
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  // 模式(mode)
  mode: 'development',
  // 入口
  entry: ['@babel/polyfill', path.resolve(__dirname, './src/main.js')],
  /* entry: {
    main: path.resolve(__dirname, './src/main.js'),
    // header: path.resolve(__dirname, './src/header.js'),
  }, */
  // 输出
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].[hash:8].js',
  },
  // loader
  module: {
    /*
        test 属性，识别出哪些文件会被转换。
        use 属性，定义出在进行转换时，应该使用哪个 loader。
    */
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false,
              },
            },
          },
        ],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: path.resolve(__dirname, 'node_modules'),
        // use: {
        //   /* loader: 'babel-loader',
        //   options: {
        //     presets: [['@babel/preset-env']],
        //   }, */
        // },
      },
      { test: /\.ts$/, use: 'ts-loader' },
      {
        test: /\.css$/,
        use: [
          {
            loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../dist/css/',
              hmr: devMode,
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            /* options: {
              plugins: [require('autoprefixer')],
            }, */
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../dist/css/',
              hmr: devMode,
            },
          },
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            /* options: {
              plugins: [require('autoprefixer')],
            }, */
          },
        ],
      },
      {
        // 打包 图片、字体、媒体、等文件
        test: /\.(jpe?g|png|gif)$/i, //图片文件
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[hash:8].[ext]',
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]',
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]',
                },
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js',
      ' @': path.resolve(__dirname, '../src'),
    },
    extensions: ['*', '.js', '.json', '.vue'],
  },
  // 插件(plugin)
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
    }),
    /* new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
      chunks: ['main'], // 与入口文件对应的模块名
    }), */
    /* new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/header.html'),
      filename: 'header.html',
      chunks: ['header'], // 与入口文件对应的模块名
    }), */
    new CleanWebpackPlugin(),
    new vueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new HappyPack({
      //用id来标识 happypack处理那里类文件
      id: 'happyBabel',
      //如何处理  用法和loader 的配置一样
      loaders: [
        {
          loader: 'babel-loader?cacheDirectory=true',
        },
      ],
      //共享进程池
      threadPool: happyThreadPool,
      //允许 HappyPack 输出日志
      verbose: true,
    }),
    new ParallelUglifyPlugin({
      cacheDir: '.cache/',
      uglifyJS: {
        output: {
          comments: false,
          beautify: false,
        },
        warnings: false,
        compress: {
          drop_console: true,
          collapse_vars: true,
          reduce_vars: true,
        },
      },
    }),
    new Webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./vendor-manifest.json'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        // 拷贝生成的文件到dist目录 这样每次不必手动去cv
        {
          from: path.resolve(__dirname, 'static'),
          to: path.resolve(__dirname, 'static'),
        },
      ],
    }),
  ],
}
