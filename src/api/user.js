/**
 * 专门放用户请求后端接口
 *
 */
import request from '@/utils/request'
// 登入请求
export function login (data) {
  return request({
    url: '/authorizations',
    method: 'post',
    data

  })
}
