<template>
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
      <!-- 上拉加载 -->
      <van-list v-model="upLoading" :finished="finished" @load="onLoad">
        <van-cell-group>
          <van-cell
            v-for="item in articles"
            :key="item.art_id.toString()"

          >
            <!-- 三张图 -->
            <div class="article_item">
              <h3 class="van-ellipsis">{{item.title}}</h3>
              <div class="img_box" v-if="item.cover.type===3">
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
               <div class="img_box" v-if="item.cover.type===1">
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
              </div>
              <div class="info_box">
                <span>{{item.aut_name}}</span>
                <span>{{item.comm_count}}</span>
                <span>{{item.pubdate | relTime}}</span>
                <span  @click="$emit('showAction',item.art_id.toString())" class="close" v-if="user.token">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import eventBus from '../../../utils/eventbus'

import { getArticles } from '../../../api/article'

export default {

  name: 'article-list',
  data () {
    return {
      articles: [],
      upLoading: false, // 是否加载数据
      finished: false, // 加载是否完成
      downLoading: false,
      refreshSuccessText: '更新成功',
      timestamp: null// 专门用来放时间戳
    }
  },
  props: {
    channel_id: {
      required: false, // 要求必须传该props属性 否则报错
      type: Number, // 类型必须是定义的类型
      default: null// 默认值
    }

  },
  methods: {
    // 上拉加载
    async onLoad () {
      // 加载方法
      //   console.log('开始加载数据')
      //   alert('开始加载数据')

      // const arr = Array.from(Array(10), (value, index) => index + 1)
      // this.articles.push(...arr) // 把生成的数据追加到末尾
      // this.upLoading = false

      // -----------------------------开始真数据
      const data = await getArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() })
      // console.log(data)

      this.articles.push(...data.results)
      // 关闭加载状态
      this.upLoading = false
      if (data.pre_timestamp) {
        // 如果有
        this.timestamp = data.pre_timestamp
      } else {
        this.finished = true // 没有数据了
      }
    },
    // 下拉刷新
    async  onRefresh () {
      // 需要弄一个睡眠函数延长请求次数
      await this.$sleep(800)

      // debugger
      // 触发下拉刷新
      // console.log('下拉刷新')
      // setTimeout(() => {
      //   const arr = Array.from(
      //     Array(10),
      //     (value, index) => '追加' + (index + 1)
      //   )
      //   this.articles.unshift(...arr) // 将数据添加到队首
      //   this.downLoading = false // 关掉下拉状态
      //   this.refreshSuccessText = `更新了${arr.length}条数据`
      // }, 1000)
      // ------------------------------开始真是数据的加载
      const data = await getArticles({ channel_id: this.channel_id, timestamp: Date.now() })
      // 求来数据此时需要关闭下拉加载的状态
      // console.log(data)

      this.downLoading = false
      if (data.results.length) {
        // 有求来数据
        this.articles = data.results
        this.finished = true // 没有数据了
        this.timestamp = data.pre_timestamp
        this.refreshSuccessText = `更新了${data.results.length}条数据`
      } else {
        // 没有求来数据
        this.refreshSuccessText = '已是最新数据'
      }
    }

  },
  created () {
    eventBus.$on('delArticle', (channelId, artId) => {
      // 找到数据并删除找到对应的channelId
      if (this.channel_id === channelId) {
        // 这时候要删除articles里的数据了
        // 先找到
        const index = this.articles.findIndex(item => item.art_id.toString() === artId)
        if (index > -1) {
          this.articles.splice(index, 1)
        }
        // 删光数据怎么办在重新加载
        if (this.articles.length === 0) {
          this.onLoad()
        }
      }
    })
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
