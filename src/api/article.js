/***
 * 专门用来求频道数据
 *
 */
import request from '@/utils/request'

export function getArticles (params) {
  return request({
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params }
  })
}
// 不感兴趣接口
export function dislikeArticles (data) {
  return request({
    url: '/article/dislikes',
    method: 'POST',
    data
  })
}
