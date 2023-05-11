/* const dom = document.getElementById('root')

// header
const header = document.createElement('div')
header.innerText = 'header'
dom.appendChild(header)
// sidebar
const siderBar = document.createElement('div')
siderBar.innerText = 'siderBar'
dom.appendChild(siderBar)
// content
const content = document.createElement('div')
content.innerText = 'content'
dom.appendChild(content)
 */

// ES Module
import Header from './components/header.js'
import Sidebar from './components/sidebar.js'
import Content from './components/content.js'

const dom = document.getElementById('root')

// header
new Header(dom)
// side-bar
new Sidebar(dom)
// content
new Content(dom)
