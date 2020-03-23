/***
 * 专门处理频道管理
 */
import request from '@/utils/request'
export function getMyChennels () {
  return request({
    url: '/user/channels'
  })
}
