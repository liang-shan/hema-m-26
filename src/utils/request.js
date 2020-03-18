
//   专门对axios进行改造

import axios from 'axios'
import JSONBig from 'json-bigint' // 引入大数字插件
import store from '@store' // 引入大数字插件

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
}, function (error) {
  // 直接返回失败
  return Promise.reject(error) // 返回执行链的 catch
})

export default instance
