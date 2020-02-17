<template>
  <div class="artistic-index">
    <div class="header">
      <div :class="{active:kind==='all'}"
           kind="all"
           keyword="景点"
           class="item-text"
           @mouseover="changeKind('all', '景点')">
          全部
      </div>
      <div :class="{active:kind==='part'}"
            kind="part"
            keyword="美食"
            class="item-text"
            @mouseover="changeKind('part', '美食')">
          约会聚餐
      </div>
      <div :class="{active:kind==='spa'}"
           kind="spa"
           keyword="丽人"
           class="item-text"
            @mouseover="changeKind('spa', '丽人')">
          丽人SPA
      </div>
      <div :class="{active:kind==='movie'}"
           kind="movie"
           keyword="电影"
           class="item-text"
           @mouseover="changeKind('movie', '电影')">
          电影演出
      </div>
      <div :class="{active:kind==='travel'}"
           kind="travel"
           keyword="旅游"
           class="item-text"
           @mouseover="changeKind('travel', '旅游')">
          品质出游
      </div>
    </div>
    <div class="content" v-loading="loading">
      <div class="content-item" v-for="(item, index) in currentItems" :key="index">
        <div class="img-wrapper">
          <img :src="item.img" alt="">
        </div>
        <div class="item-title">{{item.title}}</div>
        <div class="price-box">
          <span>￥</span>
          <span class="item-price">{{item.price}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      kind: 'all',
      list: {
        all: [],
        part: [],
        spa: [],
        movie: [],
        travel: []
      }
    }
  },
  computed: {
    currentItems() {
      return this.list[this.kind]
    }
  },
  methods: {
    async changeKind(kind, keyword) {
      setTimeout(async() => {
        this.kind = kind
        if(this.list[this.kind].length === 0) {
          this.loading = true
          let {status,data:{count,pois}} = await this.$axios.get('/search/resultsByKeywords', {
            params: {
              keyword,
              city: this.$store.state.geo.city ? this.$store.state.geo.city : this.$store.state.geo.position.city
            }
          })
          this.loading = false
          if(status===200&&count>0){
            let r= pois.filter(item=>item.photos.length).map(item=>{
              return {
                title:item.name,
                pos:item.type.split(';')[0],
                price:typeof(item.biz_ext.cost) == 'string' && item.biz_ext.cost ? item.biz_ext.cost : '暂无',
                img:item.photos[0].url,
                url:'//abc.com'
              }
            })
            this.list[this.kind]=r.slice(0,9)
            console.log(this.list)
          }else{
            this.list[this.kind]=[]
          }
        }
      }, 200);
    }
  },
  mounted() {
    this.changeKind('all', '景点')
  }
}
</script>

<style lang="scss" scoped>
.artistic-index{
  border-radius: 5px;
  overflow: hidden;
  .header{
    background-color: rgb(190, 164, 116);
    background-image: linear-gradient(to right, rgb(194, 176, 142) 3%, rgb(190, 164, 116) 100%);
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    color: #fff;
    display: flex;
    align-items: center;
    .item-text{
      margin: 0 10px;
      position: relative;
      cursor: pointer;
      &.active::after{
        position: absolute;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 7px solid #fff;
        content: " ";
        display: block;
        width: 2px;
        height: 0;
        top: 37px;
        left: 0;
        right: 0;
        margin: auto;
      }
    }
  }
  .content{
    background: #fff;
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    height: 931px;
    box-sizing: border-box;
    .content-item{
      width: 33.33%;
      padding: 10px;
      box-sizing: border-box;
      background: #fff;
      &:hover{
        background: #f4f4f4;
        transition: background-color 500ms;
        border-radius: 4px;
      }
      .img-wrapper{
        width: 100%;
        height: 208px;
        margin-bottom: 10px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .item-title{
        font-size: 16px;
        color: #222;
        height: 22px;
        line-height: 22px;
        font-weight: 500;
        margin-bottom: 10px;
      }
      .price-box{
        height: 27px;
        line-height: 27px;
        color: #BE9E4D;
        font-size: 14px;
        font-weight: 500;
        .item-price{
          font-size:22px;
        }
      }
    }
  }
}
</style>