import Router from 'koa-router'
import axios from './utils/axios'
import Menus from '../dbs/models/menus'
import Provinces from '../dbs/models/provinces'

let router = new Router({
  prefix:'/geo'
})

router.get('/getPosition', async (ctx) => {
  // 获取所在地址的接口
  let {status,data:{province,city}} = await axios.get(`http://cp-tools.cn/geo/getPosition`)
  if(status === 200) {
    ctx.body = {
      province,
      city
    }
  } else {
    ctx.body = {
      province: '',
      city: ''
    }
  }
})

// 查询菜单的接口
router.get('/menu', async (ctx) => {
  const res = await Menus.find()
  ctx.body = {
    data: res[0]
  }
})

// 获取省份的接口
router.get('/provinces', async (ctx) => {
  // // 数据库获取数据
  // let provinces = await Provinces.find()
  // ctx.body = {
  //   provinces: provinces.map((item) => {
  //     return {
  //       id: item.id, // 省份编码id
  //       name: item.value
  //     }
  //   })
  // }
  // // 网络接口获取数据
  let {status, data: {province}} = await axios.get(`http://cp-tools.cn/geo/province`)
  ctx.body = {
    provinces: status === 200 ? province : []
  }
})

// 根据省份获取对应的城市
router.get('/province/:id', async (ctx) => {
  // let city = await City.findOne({id: ctx.params.id})
  //
  // ctx.body = {
  //   code: 0,
  //   city: city.value.map(item => {
  //     return {province: item.province, id: item.id, name: item.name}
  //   })
  // }
  let {status, data: {
      city
    }} = await axios.get(`http://cp-tools.cn/geo/province/${ctx.params.id}`)
  if (status === 200) {
    ctx.body = {
      city
    }
  } else {
    ctx.body = {
      city: []
    }
  }
})

// 获取全部城市
router.get('/city', async (ctx) => {
  // let city = []
  // let result = await City.find()
  // result.forEach(item => {
  //   city = city.concat(item.value)
  // })
  // ctx.body = {
  //   code: 0,
  //   city: city.map(item => {
  //     return {
  //       province: item.province,
  //       id: item.id,
  //       name: item.name === '市辖区' || item.name === '省直辖县级行政区划'
  //         ? item.province
  //         : item.name
  //     }
  //   })
  // }
  let {status, data: {
      city
    }} = await axios.get(`http://cp-tools.cn/geo/city`);
  if (status === 200) {
    ctx.body = {
      city
    }
  } else {
    ctx.body = {
      city: []
    }
  }
})

export default router