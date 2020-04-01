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
        localStorage.setItem(JSON.stringify(result))
        resolve(result)
      })
    }
  })
}
export function getAllChennels () {
  return request({
    url: '/channels'
  })
}
