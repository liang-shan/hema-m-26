/***
 * 专门处理权限问题  导航守卫
 */

import router from '@/router'
import store from '@/store'

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/user') && !store.state.user.token) {
    next({
      path: '/login',
      query: {
        redirectUrl: to.fullPath // 登入后跳转到此页面
      }
    })
  } else {
    next()
  }
})
