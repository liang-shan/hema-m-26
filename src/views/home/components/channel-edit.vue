<template>
  <div class="channel-edit">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,index) in chennels" :key="item.id">
          <span @click="$emit('selectChannel',index)" class="f12">{{item.name}}</span>
          <van-icon class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionChennels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <van-icon class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChennels } from '../../../api/channels'
export default {
  data () {
    return {
      editing: false,
      allChennels: []
    }
  },
  props: {
    chennels: {
      required: true,
      type: Array,
      default: () => []
    }
  },
  methods: {
    async getAllChennels () {
      const data = await getAllChennels()
      this.allChennels = data.channels
      // console.log(data)
    }
  },
  computed: {
    // 挑出可选频道
    // 先找出我的频道的index
    optionChennels () {
      return this.allChennels.filter(
        item => !this.chennels.some(o => o.id === item.id)
      )
    }
  },
  created () {
    this.getAllChennels()
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
