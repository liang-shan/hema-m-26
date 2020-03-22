<template>
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh"                         :success-text="refreshSuccessText">
      <van-list v-model="upLoading" :finished="finished" @load="onLoad">
        <van-cell-group>
          <van-cell
            v-for="item in articles"
            :key="item"
            :title="`每股又荣炖了`+item"
            :value="`行情不好`+item"
          ></van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: 'article-list',
  data () {
    return {
      articles: [],
      upLoading: false, // 是否加载数据
      finished: false, // 加载是否完成
      downLoading: false,
      refreshSuccessText: '更新成功'
    }
  },
  methods: {
    onLoad () {
      // 加载方法
      //   console.log('开始加载数据')
      //   alert('开始加载数据')

      const arr = Array.from(Array(10), (value, index) => index + 1)
      this.articles.push(...arr) // 把生成的数据追加到末尾

      this.upLoading = false
    },
    onRefresh () {
      // 触发下拉刷新
      console.log('下拉刷新')
      setTimeout(() => {
        const arr = Array.from(Array(10), (value, index) => ('追加' + (index + 1)))
        this.articles.unshift(...arr) // 将数据添加到队首
        this.downLoading = false // 关掉下拉状态
        this.refreshSuccessText = `更新了${arr.length}条数据`
      }, 1000)
    }
  }
}
</script>

<style>
</style>
