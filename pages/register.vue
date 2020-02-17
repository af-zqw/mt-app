<template>
  <div>
    <div class="header">
      <div class="header-content">
        <a href="/">
          <img src="https://s0.meituan.net/bs/fe-web-meituan/fa5f0f0/img/logo.png" alt="">
        </a>
        <div class="login-tip">
          <span>已有美团账号？</span>
          <a href="/login">
            <el-button type="primary" size="mini">登录</el-button>
          </a>
        </div>
      </div>
    </div>
    <div class="form-wrapper">
      <el-form ref="form"
               :model="formParams"
               :rules="rules"
               label-width="100px">
        <el-form-item label="昵称" prop="name">
          <el-input v-model="formParams.name" placeholder="请填写昵称"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formParams.email" placeholder="请填写邮箱"></el-input>
          <el-button size="mini" round @click="sendMsg" :disabled="sendTimer">发送验证码</el-button>
          <span class="status">{{statusMsg}}</span>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="formParams.code" maxlength="4"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="formParams.pwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="cpwd">
          <el-input v-model="formParams.cpwd" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register">同意以下协议并注册</el-button>
          <div class="error">{{error}}</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import CryptoJS from 'crypto-js'
export default {
  layout: 'blank',
  data() {
    return{
      sendTimer: false,  // 判断验证码是否在有效期内
      statusMsg: '',
      error: '',
      formParams: {
        name: '',
        email: '',
        code: '',
        pwd: '',
        cpwd: ''
      },
      rules: {
        name: [
          {required:true,type:'string',message:'请输入昵称',trigger:'blur'}
        ],
        email:[
          {required:true,message:'请输入邮箱',trigger:'blur'},
          {type:'email',message:'请填写正确的邮箱格式',trigger:'blur'}
        ],
        pwd: [
          {required:true,message:'请输入密码',trigger:'blur'}
        ],
        cpwd: [
          {required:true,message:'请再次输入密码',trigger:'blur'},
          {validator:(rule,value,callback) => {
            if(value === '') {
              callback(new Error('请再次输入密码'))
            }else if(value !== this.formParams.pwd) {
              callback(new Error('两次输入密码不一致'))
            }else {
              callback()
            }
          },trigger:'blur'}
        ]
      }
    }
  },
  methods:{
    sendMsg() {
      let namePass
      let emailPass
      if(this.timerid) {  // 判断定时器是否还存在
        return false
      }
      this.statusMsg = '' // 清空计时信息
      this.$refs['form'].validateField('name',(err) => {  // 单字段验证,参数为验证不通过
        namePass = err
      })
      if(namePass) {
        return false
      }
      this.$refs['form'].validateField('email',(err) => {
        emailPass = err
      })
      if(!namePass && !emailPass) {
          this.$axios.post('/users/verify',{
            username:encodeURIComponent(this.formParams.name), // 把字符串作为url进行编码
            email: this.formParams.email
          }
        ).then((res) => {
          // console.log(res)
          if(res.data.code === 0) {
            this.$message.success(`${res.data.msg}`)
            let count = 60;
            this.sendTimer = true
            this.statusMsg = `验证码已发送，剩余${count--}秒`
            this.timerid = setInterval(() => {
              this.statusMsg = `验证码已发送，剩余${count--}秒`
              if(count === 0) {
                clearInterval(this.timerid)
                this.sendTimer = false
                this.statusMsg = ''
              }
            }, 1000);
          } else {
            this.$message.error(`${res.data.msg}`)
          }
        })
      }
    },
    register() {
      this.$refs.form.validate((valid) => {
        if(valid) {
          this.$axios.post('/users/signup',{
            username:encodeURIComponent(this.formParams.name),
            password:CryptoJS.MD5(this.formParams.pwd).toString(),
            email: this.formParams.email,
            code: this.formParams.code
          }).then((res) => {
            if(res.data.code === 0) {
              this.$message.success('注册成功')
              this.$router.push('/login')
            } else {
              this.$message.error(`${res.data.msg}`)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  height: 60px;
  border-bottom: 2px solid #d8d8d8;
  display: flex;
  justify-content: center;
  .header-content{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    height: 100%;
    img{
      height: 36px;
    }
    .login-tip{
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #666;
    }
  }
}
.form-wrapper{
  width: 550px;
  margin: 50px;
}
</style>