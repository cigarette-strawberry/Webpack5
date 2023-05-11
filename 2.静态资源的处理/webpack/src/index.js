// js 模块
const Header = require('./components/header.js')
const Sidebar = require('./components/sidebar.js')
const Content = require('./components/content.js')

// 图片模块 （这 5 个都是小图）
const icon1 = require('./assets/icons/background.png')
const icon2 = require('./assets/icons/bill.svg')
const icon3 = require('./assets/icons/blue.png')
const iconSvg1 = require('./assets/icons/cloud.gif')
const iconSvg2 = require('./assets/icons/gsjs.svg')

// 图片模块 （这 3 个都是大图）
/* const dog1 = require('./assets/images/animal-dog-1.png')
const avatar1 = require('./assets/images/avatar-1.jpg')
const cat1 = require('./assets/images/express-cat-1.gif') */

// 数据模块
const fileTxt = require('./assets/data/notes.txt')
const fileXml = require('./assets/data/hello.xml')

// 字体模块
/* const font = require('./assets/fonts/Calibre-Regular.otf')
const iconFont1 = require('./assets/fonts/iconfont.ttf')
const iconFont2 = require('./assets/fonts/iconfont.woff')
const iconFont3 = require('./assets/fonts/iconfont.woff2') */

// 样式模块
// const reset = require('./assets/styles/reset.css')
// const global = require('./assets/styles/global.scss')

// import './assets/styles/reset.css'
// import './assets/styles/global.scss'

const dom = document.getElementById('root')

// header
new Header(dom)
// side-bar
new Sidebar(dom)
// content
new Content(dom)
