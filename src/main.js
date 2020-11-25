import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
/* 导入字体图标 */
import './assets/fonts/iconfont.css'
/* 导入全局样式表 */
import './assets/css/global.css'
/*导入第三方插件*/
import TreeTable from 'vue-table-with-tree-grid'
/*导入富文本编辑器*/
import VueQuillEditor from 'vue-quill-editor'
/*导入富文本编辑器对应的样式*/
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import axios from 'axios'
/*每个vue的组件，都可通过this来直接访问$http,从而去发起ajax请求*/
Vue.prototype.$http = axios
/*配置请求的根路径*/
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
/*通过axios请求拦截器添加token，保证拥有获取数据的权限*/
axios.interceptors.request.use(config => {
    console.log(config)
    config.headers.Authorization = window.sessionStorage.getItem('token')
    /*在最后必须return config*/
    return config
})
Vue.config.productionTip = false

Vue.filter("dataFormat", function (originVal) {
    const dt = new Date(originVal)
    const year = dt.getFullYear()
    const month = (dt.getMonth() + 1 + '').padStart(2, '0')
    const day = (dt.getDate() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
})

/*将TreeTable注册为全局可用组件*/
Vue.component('tree-table', TreeTable)
/*将富文本编辑器，注册为全局可用的组件*/
Vue.use(VueQuillEditor)
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
