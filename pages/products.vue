<template>
  <div class="products">
    <crumbs :keyword="keyword" />
    <div style="display:flex;">
      <div class="left">
        <categroy :areas="areas" :types="types" />
        <list :list="list" />
      </div>
      <div class="right">
        <amap :width="250" :height="250" :point="point" v-if="point.length" />
      </div>
    </div>
  </div>
</template>

<script>
var _this;
import Crumbs from '@/components/products/crumbs.vue'
import Categroy from '@/components/products/categroy.vue'
import List from '@/components/products/list.vue'
import Amap from '@/components/base/map.vue'
export default {
  components: {
    Crumbs,
    Categroy,
    List,
    Amap
  },
  data() {
    return{
      keyword: '',
      list: [],
      areas: [],
      types: [],
      point: []
    }
  },
  methods: {
    async getProductData() {
      var keyword = this.keyword
      var city = this.$store.state.geo.city ? this.$store.state.geo.city : this.$store.state.geo.position.city

      var {status, data: {count, pois}} = await this.$axios.get('/search/resultsByKeywords', {
        params: {
          keyword,
          city
        }
      })
      console.log(count)
      var {status: status2, data: {areas, types}} = await this.$axios.get('/categroy/crumbs', {
        params: {
          city
        }
      })
      if(status === 200 && count >0 && status2 === 200) {
        var list = pois.filter(item => item.photos.length).map(item => {
            return {
              type: item.type,
              img: item.photos[0].url,
              name: item.name,
              comment: Math.floor(Math.random() * 10000),
              rate: Number(item.biz_ext.cost),
              scene: item.tag,
              tel: item.tel,
              status: '可订明日',
              location: item.location,
              module: item.type.split(';')[0]
            }
          })
        var areas = areas.filter(item => item.type !== '').slice(0, 5)
        var types = types.filter(item => item.type !== '').slice(0, 5)
        var point = (pois.find(item => item.location).location || '').split(',')
        this.list = list
        this.types = types
        this.areas = areas
        this.point = point
      }
    }
  },
  /**
   * asyncData返回的值会跟data做结合
   * 从别的页面跳转过来会等同于对这个页面发送请求，参数可以从ctx.query里面得到
   */
  // async asyncData(ctx) {
  //   let keyword = ctx.query.keyword
  //   let city = ctx.store.state.geo.position.city
  //   let {status, data: {count, pois}} = await ctx.$axios.get('/search/resultsByKeywords', {
  //     params: {
  //       keyword,
  //       city
  //     }
  //   })
  //   console.log(keyword)
  //   console.log(pois)

  //   let {status: status2, data: {areas, types}} = await ctx.$axios.get('/categroy/crumbs', {
  //     params: {
  //       city
  //     }
  //   })
    // if(status === 200 && count >0 && status2 === 200) {
    //   return {
    //     list: pois.filter(item => item.photos.length).map(item => {
    //       return {
    //         type: item.type,
    //         img: item.photos[0].url,
    //         name: item.name,
    //         comment: Math.floor(Math.random() * 10000),
    //         rate: Number(item.biz_ext.cost),
    //         scene: item.tag,
    //         tel: item.tel,
    //         status: '可订明日',
    //         location: item.location,
    //         module: item.type.split(';')[0]
    //       }
    //     }),
    //     keyword,
    //     areas: areas.filter(item => item.type !== '').slice(0, 5),
    //     types: types.filter(item => item.type !== '').slice(0, 5),
    //     point: (pois.find(item => item.location).location || '').split(',')
    //   }
    // }
  // },
  created() {
    this.keyword = this.$route.query.keyword
    this.getProductData()
    _this = this
  },
  watch: {
    $route: {
      handler:(value) => {
         _this.keyword = value.query.keyword
         _this.getProductData()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.products{
  width: 1190px;
  margin: 0 auto;
  .left{
    margin-top:10px;
    width:930px;
    margin-right: 10px;
  }
  .right{
    width: 250px;
    margin-top:10px;
  }
}
</style>