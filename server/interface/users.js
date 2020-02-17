import Router from 'koa-router'
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'
import User from '../dbs/models/users'
import Passport from './utils/passport'
import Email from '../dbs/config'

let router = new Router({
  prefix:'/users'
})

let Store = new Redis(Email.redis).client

// 发送邮箱验证码接口
router.post('/verify', async (ctx, next) => {
  let username = ctx.request.body.username
  // 在redis中取得属于这个用户名的验证码的过期时间(在config中已配置)
  const saveExpire = await Store.hget(`nodemail:${username}`,'expire')
  // 防止用户频繁请求
  if(saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁，1分钟1次'
    }
    return false
  }
  // 设置邮箱配置
  let transporter = nodeMailer.createTransport({
    host:Email.smtp.host, // 设置邮箱服务的主机，smtp.qq.com
    port:587, // 对应的端口号
    secure: false,
    auth: { // 用户信息
      user: Email.smtp.user,  // 发送者的邮箱
      pass: Email.smtp.pass  // 发送者邮箱的凭证，此处用qq邮箱
    }
  })
  let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }
  // 设置收件人信息
  let mailOptions = {
    from: `"认证邮件"<${Email.smtp.user}>`, // 设置发件人名称
    to: ko.email, // 发给谁
    subject:'高仿美团注册码', // 主题
    html:`您的邀请码是${ko.code}` // html模板
  }
  // 发送邮件
  await transporter.sendMail(mailOptions,(err,info) => {
    if(err) {
      return console.log('error')
    } else {
      // 存储到redis
      Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期1分钟'
  }
})

// 注册接口
router.post('/signup', async (ctx) => {
  const {
    username,
    password,
    email,
    code
  } = ctx.request.body;
  if(code) {
    // 从redis中取出该用户对应的code和code过期时间
    const saveCode = await Store.hget(`nodemail:${username}`,'code')
    console.log('saveCode',saveCode)
    const saveExpire = await Store.hget(`nodemail:${username}`,'expire')
    if(code != saveCode) {
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
      return
    } else { // 验证码相同
      if(new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期'
        }
        return
      } else { // 不会过期
        // 从数据库查询数据
        let user = await User.find({
          username
        })
        if(user.length) {
          ctx.body = {
            code: -1,
            msg: '已被注册'
          }
          return
        }
        let nuser = await User.create({
          username,
          password,
          email
        })
        if(nuser) { // 注册成功
          ctx.body = {
            code: 0,
            msg: '注册成功'
          }
          return
        } else {
          ctx.body = {
            code: -1,
            msg: '注册失败'
          }
          return
        }
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }
})

// 登录接口
router.post('/signin', async(ctx,next) => {
  /**
   * 使用koa-passport插件登录成功后可以设置ctx的状态，并且可以把用户信息存储在session中
   * 需要安装session中间件
   */
  return Passport.authenticate('local',function(err,user,info,status) {
    if(err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else {
      if(user) {
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        }
        // passport封装的api，用来管理session
        return ctx.login(user)
      } else {
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next)
})

router.get('/exit', async(ctx, next) => {
  await ctx.logout() // passport封装的api，用来管理session
  // ctx.isAuthenticated() 判断是否认证
  if(!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})

router.get('/getUser', async(ctx) => {
  if(ctx.isAuthenticated()) {
    const {username,email} = ctx.session.passport.user
    ctx.body = {
      user:username,
      email
    }
  } else {
    ctx.body = {
      user: '',
      email: ''
    }
  }
})

export default router