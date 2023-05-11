// webpack 配置文件
const path = require('path')
// 设置SVG图片
const miniSVGDataURI = require('mini-svg-data-uri')

module.exports = {
  mode: 'development', // 生产模式
  entry: {
    main: './src/index.js', // 入口文件
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    /* 每次打包后，文件都会根据 output 的配置放进输出文件夹，但是对于压缩处理的文件则不会被打包到文件夹，只会以base64 编码格式或者 URI 编码等格式存在于 bundle.js 的源码中。 */
    filename: 'bundle.js',
    // 静态文件打包后的路径及文件名（默认是走全局的，如果有独立的设置就按照自己独立的设置来。）
    assetModuleFilename: 'assets/[name]_[hash][ext]',
  },
  // *** 模块选项中匹配的文件会通过 loaders 来转换！
  module: {
    rules: [
      // 图片文件
      {
        test: /\.(jpe?g|png|gif)$/i,
        type: 'asset', // 一般会转换为 "asset/resource"
        generator: {
          filename: 'images/[name]_[hash][ext]', // 独立的配置
        },
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb （低于8kb都会压缩成 base64）
          },
        },
      },
      // svg文件
      {
        test: /\.svg$/i,
        type: 'asset/inline',
        generator: {
          filename: 'icons/[name]_[hash][ext]',
          dataUrl(content) {
            content = content.toString()
            return miniSVGDataURI(content) // 通过插件提供的编码算法处理文件
          },
        },
        parser: {
          dataUrlCondition: {
            maxSize: 2 * 1024, // 2kb （低于2kb都会压缩）
          },
        },
      },
      // 字体文件
      {
        test: /\.(otf|eot|woff2?|ttf|svg)$/i,
        type: 'asset', // 一般会转换为 "asset/inline"
        generator: {
          filename: 'fonts/[name]_[hash][ext]',
        },
      },
      // 数据文件
      {
        test: /\.(txt|xml)$/i,
        type: 'asset/source', // 一般会转换成 "asset/source"
      },
      /* {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
      }, */
      {
        // sass-loader：加载一个 Sass/SCSS 文件，并编译成 CSS。
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              modules: true, // 默认是 false ***
            },
          },
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },
}

/* 配置静态文件名
generator: {
  filename: 'images/[name]_[hash][ext]' // 单独配置打包的路径及文件名
}
[name] 表示原来的文件名，[hash] 表示散列值，[ext] 表示文件后缀。 */

/* 
一、Loaders — 加载器
loaders 可以帮我们预处理任何静态文件并打包。

二、Asset Modules — 静态资源模块
type: 'asset'
每次打包后，文件都会根据 output 的配置放进输出文件夹，但是对于压缩处理的文件则不会被打包到文件夹，只会以base64 编码格式或者 URI 编码等格式存在于 bundle.js 的源码中。

1. 特殊处理
某些文件需要特殊处理。例如，SVG 文件转换为 URI 编码后，与 base64 相比，体积会更小；
处理 txt、xml 文件 type: 'asset/source' 更好，它会导出资源的源码，这样就能看到全貌，而非 base64 格式的编码字符串。

最小化 SVG 文件需要安装一个第三方库：mini-svg-data-uri      npm i -D mini-svg-data-uri
      // svg文件
      {
        test: /\.svg$/i,
        type: "asset/inline",
        generator: {
          dataUrl(content) {
            content = content.toString();
            return miniSVGDataURI(content);
          },
        },
      },
把 SVG 文件 处理成 URI 编码

2. 配置静态文件名
默认情况下，打包以后的文件是散在 dist 文件夹中的，难以区分和维护。
现在，需要将他们分门别类地放进对应的文件夹中，就需要对文件名做统一的管理。
      assetModuleFilename: "assets/[name]_[hash][ext]",

      generator: {
        filename: 'images/[name]_[hash][ext]' // 单独配置打包的路径及文件名
      },
assetModuleFilename: 'assets/[name][ext]', 用于设置全局的静态文件路径及文件名。如果文件模块没有单独进行配置，就按照这个来设置文件名。
[name] 表示原来的文件名，[hash] 表示散列值，[ext] 表示文件后缀。

3. asset 类型
当 type 设置为'asset'，就会按照以下的策略去打包文件：
+ 如果一个模块大小超过 8 kb（这个值是默认的），就使用 asset/resource，被打包进输出文件夹中。（类似于 file-loader）
+ 否则，就使用 asset/inline，内联到打包文件中。(类似于 url-loader)
区别在于：前者会被单独放进输出文件夹中，后者被处理成 base64 编码字符串内敛进打包出的 JS 文件中。
后者的好处在于减少一次 http 请求，但是过长的字符串也会加重 js 的体积导致加载变慢，因此需要根据实际情况来确定到底采用哪一种方式去处理文件。
注意，当被作为后者处理时，是可以设置编码方式的，例如上面提到的特殊处理。
      parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8kb （低于8kb都会压缩成 base64）
          }
      },
一共有四个类型：asset   asset/resource   asset/inline   asset/source

三、样式文件的处理

1. style-loader 和 css-loader 是相辅相成的。
+ style-loader：将 <style> 标签插入到 DOM 中。
+ css-loader：解析通过 @import、url()、import/require() 这些方式引入的样式文件。

npm install --save-dev css-loader style-loader
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
        注意两个 loader 的位置，要反过来写。
      },

2. sass-loader
sass-loader：加载一个 Sass/SCSS 文件，并编译成 CSS。

npm install sass-loader sass webpack --save-dev
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },

3. postcss-loader
npm install --save-dev postcss-loader postcss
      {
        test: /\.s?css$/i,
        use: ["style-loader", "css-loader", "sass-loader", "postcss-loader"],
        postcss-loader 要放在最后。
      },

+ Autoprefixer   自动刷新器
PostCSS插件，用于解析CSS并使用Can I Use中的值向CSS规则添加供应商前缀。

+ PostCSS Preset   Env 邮政编码预设环境
PostCSS Preset Env允许您将现代CSS转换为大多数浏览器都能理解的内容，根据目标浏览器或运行时环境确定所需的多边形填充。

+ PostCSS SCSS Syntax   postsss-SCSS语法
用于PostCSS的SCSS解析器。
此模块不编译SCS。它简单地将mixin解析为自定义at规则，将变量解析为属性，这样postsss插件就可以将SCSS源代码与CSS一起转换。

npm install postcss-preset-env autoprefixer postcss-scss --save-dev
在根目录下，新建：postcss.config.js
      module.exports = {
        syntax: "postcss-scss",
        plugins: [require("autoprefixer"), "postcss-preset-env"],
      };
webpack.config.js 不需要修改。

四、补充：css-loader 的 options

1 .不同的 loader 都会有各自的 options，css-loaders 有两个实用的 options。
+ 允许你在执行 css-loader 前，让某些资源要经过前面的 loaders 去处理的个数。
+ 允许你开启 CSS Module。
      {
        test: /\.sc?ss$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              modules: true, // 默认是 false ***
            },
          },
          "sass-loader",
          "postcss-loader",
        ],
      },
    + 上面 importLoaders 设置为 2，表示匹配到样式文件时，都会去执行一开始的两个 loader，也就是 'sass-loader' 以及 'postcss-loader'。
    + modules 设置为 true，则保证了样式模块的独立性，不会被互相覆盖。
    + 利用 CSS Module 的方式来添加样式的方法，解决了全局覆盖同名样式（一般是类名和 id）



小结
在 Webpack5 中，对于静态资源的处理，我们只要简单地设置 type 就能处理文件，非常方便。但是有些特殊情况还是需要去单独处理的，例如资源输出的路径及文件名的设置、URI 编码格式的设置、转 base64 的文件大小限制的设置。样式文件中，为了防止全局的样式污染，可以开启 CSS Module 来避免。
*/
