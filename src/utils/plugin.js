/****
 * 专门处理比较小的函数
 *
 */
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'// 引入dayjsde 语言插件
import relativeTime from 'dayjs/plugin/relativeTime' // 引入相对时间的插件
dayjs.extend(relativeTime)// 需要对插件进行扩展
export default {
  // 导出一个默认对象
  install (Vue) {
    //   该方法会在Vue.use时调用
    // 执行此行代码时 Vue.prototype.$notify 应该已经挂载完成
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params }) // 小伎俩
    // 给Vue的原型属性赋值一个函数 自定义一个函数名

    // 封装一个睡眠那函数
    Vue.prototype.$sleep = sleep
    // 把格式化时间封装成过滤器
    Vue.filter('relTime', relTime)
  }
}
// 睡眠函数
function sleep (time = 500) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => { resolve() }, time)
  })
}
// 格式化时间函数
function relTime (date) {
  return dayjs().locale('zh-cn').from(date)
}
