import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '../utils/auth.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 专门来放共享状态的,共享数据之类的东西
    // 要放token
    user: auth.getUser()
  },
  mutations: {
    // 要改token只能通过mutation
    // 修改token  需要定义一个方法
    updateToken (state, payload) {
      state.user = payload.user// 把新的数据赋值给老的数据
      auth.setUser(payload.user) // 相当于 保持 vuex和 本地存储的同步
    },
    // 删除token
    delUser (state) {
      state.user = {} // 将vuex中的token设置为空对象
      // 缓存数据也需要更新
      auth.delUser() // 删除本地缓存中的token
    }

  },
  actions: {
  },
  modules: {
  }
})
