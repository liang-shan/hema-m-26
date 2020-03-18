/*
 *此文件专门处理token问题
 */
const USER_TOKEN = 'hm-toutiao-m-26'// 专门用来储存用户信息

// 设置用户的token
export function setUser (user) {
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user))// 存进去必须是json格式的字符串
}

// 获取用户的token
export function getUser () { // 得判断如果没有获取到怎么办
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || '{}')// 取出来是json版的字符串,转成正常的字符串
}

// 删除用户的token
export function delUser () {
  localStorage.removeItem(USER_TOKEN)
}
