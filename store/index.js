/**
 * nuxt3 vuex改写:https://blog.csdn.net/weixin_45115705/article/details/98784259
 * nuxtServerInit配置: https://www.jianshu.com/p/a37fd499f0c1
 */
export const actions = {
  async nuxtServerInit({commit},{req,app}) { // 服务端渲染
    // 获取当前城市
    const {status, data: {province, city}} = await app.$axios.get('/geo/getPosition')
    commit('geo/setPosition', status === 200 ? {city, province} : {city: '', province: ''})
    // 获取菜单
    const {data:{data:{menu}}} = await app.$axios.get('/geo/menu')
    commit('home/setMenu',menu)

    // 获取热门搜索
    const {status: status2, data: {result}} = await app.$axios.get('/search/hosPlace',{
      params: {
        city: app.store.state.geo.position.city.replace('市', '')
      }
    })
    commit('home/setHotPlace', status2 === 200 ? result : [])
  }
}