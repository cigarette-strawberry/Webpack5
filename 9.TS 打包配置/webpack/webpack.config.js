const path = require('path')

module.exports = {
  entry: './src/index.ts', // 注意这里原来是 './src/index.js'，需要改成 ts 结尾！
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
/*
一、TS
TypeScript 是 JavaScript 类型的超集，它能够被转换为普通的 JavaScript。为了在 webpack cli 中使用 ts，就需要安装特定的 loader 来“翻译” ts 语法。

1 依赖安装
npm install --save-dev typescript ts-loader

2 tsconfig.json
在根目录下新建 tsconfig.json，它是 ts 的配置文件。

3 webpack.config.js
这样一来，将会引导 webpack 进入 "./src/index.ts" ，然后利用 ts-loader 加载所有的 .ts 以及 .tsx 结尾的文件，最后在当前目录下生成一个 bundle.js 文件。

注意：
+ 入口文件需要改后缀，我们现在用 ts 了，不用 js ；
+ 配置规则中的 tsx 指的是：ts + jsx ；
+ resolve 可以配置模块的解析方式，一般常用来设置 alias 别名以及 extensions 后缀名解析顺序。
*/

/* 
二、js 改写为 ts 的示例

1 js 示例
// greeter.js
import _ from 'lodash';

class Greeter {
 constructor (message) {
  this.greeting = message;
 }
 greet () {
  return _.join(['Hello ', this.greeting], '');
 }
}

export default Greeter;

// index.js
import Greeter from "./ts/greeter";
let greeter = new Greeter("JavaScript!");

let button = document.createElement("button");
button.textContent = "Say Hello";
button.onclick = function () {
  alert(greeter.greet());
};

document.body.appendChild(button);

2 ts 示例


import * as _ from "lodash"; // 注意这里！
// greeter.ts
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return _.join(["Hello, ", this.greeting], "");
  }
}

export default Greeter;

注意：
+ 由于 lodash.js 没有默认导出，所以需要改为上面的写法。
+ 如果想要按照原来的 import _ from 'lodash'; ，则需要在 tsconfig.js 中添加参数allowSyntheticDefaultImports，将它设置为 true 即可。

*/

/* 
三、声明文件
在 TS 中，有一类文件是以 .d.ts 结尾的，这一类文件属于类型声明文件。TS 比 JS 多了类型检查，而这个声明文件就是类型检查的关键，所以为了让 TS 能够识别第三方库的 JS，就需要安装特定的声明文件。按照错误提示，我们需要按照以下依赖：@types/lodash
npm i --save-dev @types/lodash



小结
+ 要想在项目中添加 TS 相关的配置，则先要安装 typescript 和 ts-loader；
+ 依赖安装完成后，需要添加 tsconfig.js 和相关配置参数，以及在 webpack.config.js 中添加 ts-loader 的规则；
+ 在使用第三方库的时候，注意需要安装对应的类型声明文件，避免引用错误。
*/
