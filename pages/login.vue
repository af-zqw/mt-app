<template>
  <div class="login-index">
    <div class="img-wrapper">
      <a href="/">
         <img class="logo" src="https://s0.meituan.net/bs/fe-web-meituan/fa5f0f0/img/logo.png" alt="">
      </a>
      <img src="https://s0.meituan.net/bs/file/?f=fe-sso-fs:build/page/static/banner/www.jpg" alt="">
    </div>
    <div class="form-wrapper">
      <el-form ref="form" :model="formParams" label-width="70">
        <el-form-item prop="name" label="用户名">
          <el-input v-model="formParams.name"></el-input>
        </el-form-item>
        <el-form-item prop="pwd" label="密码">
          <el-input v-model="formParams.pwd" :type="pwdType">
            <i @click.stop="changeType" slot="suffix" class="el-icon-view" :class="{active:showPwd}"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import CryptoJS from 'crypto-js'
export default {
  layout: 'blank',
  data() {
    return {
      formParams: {
        name: '',
        pwd: ''
      },
      showPwd: false,
      pwdType: 'password'
    }
  },
  methods: {
    changeType() {
      this.showPwd = !this.showPwd
      this.pwdType = this.pwdType == 'password' ? 'text' : 'password'
    },
    login() {
      if(!this.formParams.name || !this.formParams.pwd) {
        this.$message.info('请填写完整的用户名或密码')
        return
      } else {
        axios.post('/users/signin',{
          username: encodeURIComponent(this.formParams.name),
          password: CryptoJS.MD5(this.formParams.pwd).toString()
        }).then((res) => {
          if(res.data.code === 0) {
            this.$message.success('登录成功')
            this.$router.push('/')
          } else {
            this.$message.error('登录失败')
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-index{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
  .img-wrapper{
    display: flex;
    flex-direction: column;
    .logo{
      height: 36px;
      width: 100px;
      cursor: pointer;
    }
  }
  .form-wrapper{
    width: 400px;
    .el-icon-view{
      padding: 5px;
      cursor: pointer;
      &.active{
        color: $main-color;
      }
    }
  }
}
</style>