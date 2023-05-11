/* import './assets/index.css'
import './assets/index.less'
console.log('初始化项目')
console.log('没配置webpack.config')
console.log('配置webpack.config') */
import Vue from 'vue'
import App from './app'
new Vue({
  render: (h) => h(App),
}).$mount('#app')
