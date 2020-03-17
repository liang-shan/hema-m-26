import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant' // 引入移动组件大亨vant
import 'vant/lib/index.css' // 引入vant组件的样式

import 'amfe-flexible'// 随着屏幕的变化字体跟着变化
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
