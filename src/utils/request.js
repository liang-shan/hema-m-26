
//   专门对axios进行改造

import axios from 'axios'
import JSONBig from 'json-bigint' // 引入大数字插件
import store from '../store'
import router from '../router'

const instance = axios.create({ // 相当于new了一个新的实例
  // 首先要设置一下基地址
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0',
  // 这是处理大数据的问题
  transformResponse: [function (data) {
    //   data就是后端响应回来的字符串
    // JSON.parse()
    return data ? JSONBig.parse(data) : {}
  }]
})

// 开始注入token,在请求之前注入,就用请求拦截器
instance.interceptors.request.use(function (config) {
  // 成功的时候 如何处理
  // 读取配置信息 给配置信息中注入token
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}` // 将token 统一注入到headers中
  }
  // 不用 if else的用法
  // config.headers.Authorization && (config.headers.Authorization = `Bearer ${store.state.user.token}`) // 将token 统一注入到headers中
  return config // 返回配置
}, function (error) {
  // 直接返回 promise的错误
  return Promise.reject(error) // 返回错误 这样的话会直接进入到axios的catch中
})
// 解构赋值
instance.interceptors.response.use(function (response) {
  // response实际上已经被 axios 默认包了一层数据  data才是 我们之前处理过的数据
  // 几乎所有的返回数据都有一层data
  try {
    return response.data.data // 如果成功则返回  如果两层可以解开 就返回两层
  } catch (error) {
    //  如果失败 说明 response.data不存在  如果两层解不开 就返回一层
    return response.data
  }
}, async function (error) {
  // error 里边有三个对象  config 错误的配置信息  request  错误的请求对象  response  错误的响应对象
  // 响应拦截器只要是401  就是token的问题  就要处理token
  if (error.response && error.response.status === 401) {
    const path = {
      path: '/login',
      query: {
        // 需要传递的query参数
        redirectUrl: router.currentRoute.fullPath // 表示登录页需要跳转的地址
      }
    }
    if (store.state.user.refresh_token) {
      // 如果有就说明你有救命的稻草
      // 这里用axios来换取新的token ,  因为显得token失效,用instense的话还会将失效的token注入一直循环下去

      try {
        const result = await axios({

          // 此时需要穿完整的地址,因为基地址是给instense设置的这用不了
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          method: 'put',
          headers: { authorization: `Bearer ${store.state.user.refresh_token}` }
        })
        // result.data.data.token // 这就换取了新的token
        // 需要把新的token从新设置给  用到store的设施token的方法
        store.commit('updateToken', {
          user: {
            token: result.data.data.token,
            refresh_token: store.state.user.refresh_token
          }
        })

        return instance(error.config)// 就相当于把之前401的错误又执行了一遍,换取了新的token
      } catch (error) {
        // 回到登入页面  删除token
        store.commit('delUser') // 删除token
        router.push(path)
      }
    } else {
      // 没有直接跳到登入页面
      // 从A页面实效的返回到登入页面成功之后还想回到A页面
      store.commit('delUser') // 删除token

      router.push(path)
    }
  }
  return Promise.reject(error) // 返回执行链的 catch
})
export default instance
