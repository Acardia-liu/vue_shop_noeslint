import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
/* 导入字体图标 */
import './assets/fonts/iconfont.css'
/* 导入全局样式表 */
import './assets/css/global.css'

import axios from 'axios'
/*每个vue的组件，都可通过this来直接访问$http,从而去发起ajax请求*/
Vue.prototype.$http = axios
/*配置请求的根路径*/
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
