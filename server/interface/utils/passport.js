import passport from 'koa-passport'
import LocalStrategy from 'passport-local' // 本地策略
import UserModel from '../../dbs/models/users'

// 在使用 passport.authenticate('策略', ...) 的时候，会执行策略
passport.use(new LocalStrategy(async function(username, password, done) {
  let where = {
    username
  }
  let result = await UserModel.findOne(where)
  if(result!=null) {
    if(result.password === password) {
      return done(null, result)
    } else {
      return done(null,false,'密码错误')
    }
  } else {
    return done(null, false, '用户不存在')
  }
}))

// 序列化ctx.login()触发
passport.serializeUser(function(user,done){
  done(null,user)
})

// 反序列化（请求时，session中存在"passport":{"user":"1"}触发）
passport.deserializeUser(function(user,done) {
  return done(null,user)
})

export default passport