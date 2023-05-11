import './main.css'
import './sass.scss' // 引入 Sass 文件
import logo from '../public/avatar.png'
import $ from 'jquery'

$('p').animate()

// 引入字体图标文件
import './fonts/iconfont.css'

const a = 'Hello ITEM'
console.log(a)

const img = new Image()
img.src = logo

document.getElementById('imgBox').appendChild(img)

// ES6 语法
class Author {
  name = 'ITEM'
  age = 18
  email = 'lxp_work@163.com'

  info = () => {
    return {
      name: this.name,
      age: this.age,
      email: this.email,
    }
  }
}

// 新增装饰器的使用
@log('hi')
class MyClass {}

function log(text) {
  return function (target) {
    target.prototype.logger = () => `${text}，${target.name}`
  }
}

const test = new MyClass()
test.logger()

/* // 按需加载
img.addEventListener('click', () => {
  import('./desc').then(({ default: element }) => {
    console.log(element)
    document.body.appendChild(element)
  })
}) */

// 按需加载 prefetch (预获取)：浏览器空闲的时候进行资源的拉取
img.addEventListener('click', () => {
  import(/* webpackPrefetch: true */ './desc').then(({ default: element }) => {
    console.log(element)
    document.body.appendChild(element)
  })
})

// // 按需加载 preload (预加载)：提前加载后面会用到的关键资源 因为会提前拉取资源，如果不是特殊需要，谨慎使用
// img.addEventListener('click', () => {
//   import(/* webpackPreload: true */ './desc').then(({ default: element }) => {
//     console.log(element)
//     document.body.appendChild(element)
//   })
// })

export { Author }
