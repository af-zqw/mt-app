import Router from 'koa-router'
import axios from './utils/axios'
import Pois from '../dbs/models/pois'

let router = new Router({
  prefix: '/search'
})

// 获取搜索结果的接口
router.get('/top', async (ctx) => {
  // let pois = await Pois.find()
  // ctx.body = {
  //   pois
  // }

  let {status, data: {top}} = await axios.get(`http://cp-tools.cn/search/top`, {
    params: {
      input: ctx.query.input,
      city: ctx.query.city
    }
  })
  ctx.body = {
    top: status === 200 ? top : []
  }
})

// 获取热门搜索的接口
router.get('/hosPlace', async (ctx) => {
  let city = ctx.store ? ctx.store.geo.position.city : ctx.query.city
  let {status, data: {result}} = await axios.get(`http://cp-tools.cn/search/hotPlace`, {
    params: {
      city
    }
  })
  ctx.body = {
    result: status === 200 ? result : []
  }
})

router.get('/resultsByKeywords', async (ctx) => {
  const {city, keyword} = ctx.query
  let {status, data: {count, pois}} = await axios.get('http://cp-tools.cn/search/resultsBykeywords',{
    params: {
      city,
      keyword
    }
  })
  ctx.body = {
    count: status === 200 ? count : 0,
    pois: status === 200 ? pois: []
  }
})


export default router