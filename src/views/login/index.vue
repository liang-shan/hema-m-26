<template>
    <div class='container'>
    <!-- 导航 显示返回箭头-->
    <!-- click-left点击左侧事件 -->
    <!-- $router.go(-1) $router.back() -->
    <van-nav-bar title='登录'  left-arrow @click-left="$router.back()"></van-nav-bar>
    <!-- 登录布局 -->
    <!-- 外层需要用cell-group组件来包裹提供 边框 -->
    <van-cell-group>
        <!-- 登录手机号 -->
          <van-field @blur="checkMobile"  v-model="loginForm.mobile"  :error-message="errMsg.mobile" label="手机号"  placeholder="请输入手机号"></van-field>
        <!-- 验证码 -->
          <van-field @blur="checkCode"  v-model="loginForm.code" :error-message="errMsg.code" label="验证码"  placeholder="请输入验证码">
            <!-- 插槽内容 -->
              <van-button slot="button" size="small" type="primary">发送验证码</van-button>
          </van-field>
    </van-cell-group>
    <!-- 登录按钮 -->
    <div class='login-box'>
      <van-button  @click="login"  type="info" round size="small" block>登录</van-button>
    </div>
  </div>
</template>

<script>

import { login } from '@/api/user.js'
// import request from '../../utils/request'
import { mapMutations } from 'vuex'

export default {
  name: 'login',
  data () {
    return {
      // 数据的双向绑定
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      },
      // 错误信息的绑定
      errMsg: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    ...mapMutations(['updateToken']),
    checkMobile () {
      // alert(1)
      if (!this.loginForm.mobile) {
        this.errMsg.mobile = '手机号不能为空'
        return false
      }
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errMsg.mobile = '手机号格式不正确'
        return false
      }
      this.errMsg.mobile = ''
      return true
    },
    checkCode () {
    // alert(1)
      if (!this.loginForm.code) {
        this.errMsg.code = '验证码不能为空'
        return false
      }
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errMsg.code = '验证码格式不正确'
        return false
      }
      this.errMsg.code = ''
      return true
    },
    async login () {
      if (this.checkMobile() && this.checkCode()) {
        // alert('登入成功')

        const result = await login(this.loginForm)
        console.log(result)

        // 里边有新的token  和reflsh_token  更新token
        this.updateToken({ user: result })
        // this.$gnotify({ type: 'success', message: '登录成功' })
        const { redirectUrl } = this.$route.query // 解构当前的路由信息
        this.$router.push(redirectUrl || '/') // 短路表达式
      }
    }
  }

}
</script>

<style>
.login-box {
  padding: 20px
}
</style>
