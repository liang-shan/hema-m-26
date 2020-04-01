/***
 * 专门处理频道管理
 */
import store from '../store'
import request from '@/utils/request'

// 存两个频道类型 1,登入用户2,游客,存本地要用(名,值)先定义两个名字
const CACHE_CHANNEL_V = 'hm-94-toutiao-v' // 登录用户的key
const CACHE_CHANNEL_T = 'hm-94-toutiao-t' // 游客用户的key

export function getMyChennels () {
  // 数据本地化,从后台弄到的数据本地化,
  // 工作步骤,先看看本地有没有-->(有)直接返回
  // -->(没有)从后端弄到后存入本地,并返回数据
  return new Promise(function (resolve, reject) {
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    const str = localStorage.getItem(key)
    if (str) {
      resolve({ channels: JSON.parse(str) })
    } else {
      request({ url: '/user/channels' }).then(result => {
        localStorage.setItem(key, JSON.stringify(result.channels))
        resolve(result)
      })
    }
  })
}
// 获取全部频道
export function getAllChennels () {
  return request({
    url: '/channels'
  })
}
// 删除频道api
export function delChennels (id) {
  return new Promise(function (resolve, reject) {
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    const channels = JSON.parse(localStorage.getItem(key))
    // 找到删除的项
    const index = channels.findIndex(item => item.id === id)
    if (index > -1) {
      channels.splice(index, 1) // 删除对应的下标元素
      localStorage.setItem(key, JSON.stringify(channels)) // 重新写入缓存
      // 如果执行成功了 我们应该 resolve()
      resolve() // resolve 可以传参 也可以不传参
    } else {
      reject(new Error('没有找到对应的频道'))
    }
  })
}
