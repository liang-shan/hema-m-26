<template>
  <div class="container">
    <van-tabs v-model="activeIndex" swipeable>
      <van-tab :title="item.name" v-for="item in chennels" :key="item.id">
        <!-- 这里注意 这个div设置了滚动条 目的是 给后面做 阅读记忆 留下伏笔 -->
        <!-- 阅读记忆 => 看文章看到一半 滑到中部 去了别的页面 当你回来时 文章还在你看的位置 -->
        <articleList @showAction="openAction" :channel_id="item.id"></articleList>
      </van-tab>
    </van-tabs>
    <span @click="openChannelEdit" class="bar_btn">
      <van-icon  name="wap-nav" />
    </span>
    <!-- 举报弹层 -->
    <van-popup :style="{ width: '80%' }" v-model="showMoreAction">
      <MoreAction @dislike="dislikeArticle"></MoreAction>
    </van-popup>
    <!-- 频道管理弹层 -->
    <van-action-sheet :round="yuanJ" v-model="showChannelEdit" title="标题">
         <channelEdit @selectChannel="selectChannel" :activeIndex="activeIndex" :chennels="chennels"></channelEdit>
    </van-action-sheet>
  </div>
</template>

<script>
import MoreAction from './components/more-action'// 弹层喜欢不喜欢组件
import articleList from './components/article-list'// 文章组件
import channelEdit from './components/channel-edit'// 频道编辑组件

import eventBus from '../../utils/eventbus'

import { getMyChennels } from '../../api/channels'
import { dislikeArticles } from '../../api/article'

export default {
  name: 'home', // devtools查看组件时  可以看到 对应的name名称
  components: {
    articleList,
    MoreAction,
    channelEdit

  },
  data () {
    return {
      activeIndex: 0,
      chennels: [],
      showMoreAction: false, // 控制反馈组件显示隐藏
      articleId: null, // 不感兴趣接口需要文章id
      showChannelEdit: false, // 频道编辑的显示与否
      yuanJ: false
    }
  },
  methods: {
    selectChannel (index) {
      // alert(index)
      this.activeIndex = index//  activeIndex这玩意只接受index,必须根据id找到索引
      this.showChannelEdit = false
    },
    async getMyChennels () {
      const data = await getMyChennels()
      this.chennels = data.channels
      // console.log(data)
    },
    // 打开弹层的事件
    openAction (artId) {
      this.showMoreAction = true
      this.articleId = artId
    },
    // 打开频道显示界面
    openChannelEdit () {
      this.showChannelEdit = true
    },
    async dislikeArticle () { // 不喜欢并要删除对应的数据(article-list里的数据)
      try {
        await dislikeArticles({ target: this.articleId })
        // 成功后弹出""操作成功"
        this.$gnotify({
          type: 'success',
          message: '操作成功'
        })
        // 删除不喜欢的数据
        // 用事件公交车广播一个删除事件eventbus.$emit(),
        // 还要告诉要在哪个频道也就是当前激活的频道id,this.chennels[this.activeIndex].id,删除哪个文章哪个文章this.articleId,把事件传过去,把数据也传过去

        eventBus.$emit('delArticle', this.chennels[this.activeIndex].id, this.articleId)
        // 关闭弹层

        this.showMoreAction = false
      } catch (error) {
        this.$gnotify({
          message: '操作失败'
        })
      }
    }

  },

  created () {
    this.getMyChennels()
  }
}
</script>

<style lang="less" scoped>
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
