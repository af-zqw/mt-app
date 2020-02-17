<template>
  <el-row type="flex" justify="center" class="search-bar">
    <el-col class="search-wrapper">
      <el-row :gutter="12" class="search-content">
        <el-col :span="5">
          <img src="https://s0.meituan.net/bs/fe-web-meituan/fa5f0f0/img/logo.png" alt="">
        </el-col>
        <el-col :span="14" style="position:relative;height:100%;">
          <div class="input-wrapper">
            <el-input @focus="inputFocus"
                      @blur="inputBlur"
                      @input="input"
                      v-model="search"
                      placeholder="搜索商家或地点">
            </el-input>
            <el-button type="primary" @click="toProductsByBtn"><i class="el-icon-search"></i></el-button>
          </div>
          <div style="position:relative;left:70px;">
            <dl class="hotPlace" v-if="!search&&isFocus">
              <dt>热门搜索</dt>
              <dd v-for="(item, index) in $store.state.home.hotPlace" :key="index" @click="toProducts(item.name)">
                <!-- <a :href="'/products?keyword='+encodeURIComponent(item.name)">{{item.name}}</a> -->
                {{item.name}}
                <!-- <nuxt-link :to="'/products?keyword='+encodeURIComponent(item.name)">{{item.name}}</nuxt-link> -->
              </dd>
            </dl>
            <dl class="searchList" v-if="search&&isFocus">
              <dd v-for="(item, index) in searchList" :key="index" @click="toProducts(item.name)">
                <!-- <a :href="'/products?keyword='+encodeURIComponent(item.name)">{{item.name}}</a> -->
                {{item.name}}
              </dd>
              <dd v-if="showNoneSearch">没有搜索结果</dd>
            </dl>
          </div>
          <div class="home-links">
            <span>
              <nuxt-link to="/order">美团外卖</nuxt-link>
            </span>
            <span>
              <nuxt-link to="/order">猫眼电影</nuxt-link>
            </span>
            <span>
              <nuxt-link to="/order">美团酒店</nuxt-link>
            </span>
            <span>
              <nuxt-link to="/order">民宿/公寓</nuxt-link>
            </span>
            <span>
              <nuxt-link to="/order">商家入驻</nuxt-link>
            </span>
            <span>
              <nuxt-link to="/order">美团公益</nuxt-link>
            </span>
          </div>
        </el-col>
        <el-col :span="5"></el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import _ from 'loadsh'
var _this;
export default {
  data() {
    return{
      search: '',
      isFocus: false,
      hotPlace: [],  // 热门搜索
      searchList: [],  // 搜索结果
      showNoneSearch: false
    }
  },
  methods: {
    inputFocus() {
      this.isFocus = true
    },
    inputBlur() {
      setTimeout(() => {
        this.isFocus = false
      },300)
    },
    // 输入事件
    input: _.debounce(async () => {
      let city = _this.$store.state.geo.position.city.replace('市', '')
      _this.searchList = []
      // get传参要像这样写
      let {status, data: {top}} = await _this.$axios.get('/search/top', {
        params: {
          input: _this.search,
          city
        }
      })
      _this.searchList = top.slice(0, 10)
      if(_this.searchList.length === 0) {
        _this.showNoneSearch = true
      } else {
        _this.showNoneSearch = false
      }
      // console.log(_this.searchList)
    }, 300),
    toProducts(name) {
      this.$router.push(`/products?keyword=${encodeURIComponent(name)}`)
    },
    toProductsByBtn() {
      this.$router.push(`/products?keyword=${encodeURIComponent(this.search)}`)
      this.search = ''
    }
  },
  created() {
    _this = this
  }
}
</script>

<style lang="scss" scoped>
.search-bar{
  color: $main-color;
  background: #fff;
  height: 160px;
  box-shadow: 0 2px 27px 0 rgba(0,0,0,0.10);
  .search-wrapper{
    width: 1190px;
    .search-content{
      margin-top: 30px;
      height: calc(100% - 30px);
      .input-wrapper{
        display: flex;
        justify-content: center;
        /deep/.el-input{
          width: 470px;
          border-radius: 5px 0 0 5px;
          .el-input__inner{
            border-radius: 4px 0 0 4px;
          }
        }
      }
      .el-button{
        border-radius: 0 4px 4px 0;
        width: 80px;
      }
      .hotPlace,.searchList{
        width: 470px;
        background: #fff;
        box-sizing: border-box;
        color: #646464;
        line-height: 23px;
        font-size: 12px;
        box-shadow: 0 3px 5px 0 rgba(0,0,0,0.1);
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        border: 1px solid #E5E5E5;
        border-top: none;
        position: absolute;
        z-index: 9999;
        dt{
          color: gray;
          font-weight: bold;
          padding: 2px 6px;
        }
        dd{
          z-index: 9999;
          padding: 2px 6px;
          width: 100%;
          height: 25px;
          cursor: pointer;
          &:hover{
            color: #FE8C00;
          }
          a{
            color: #646464;
            width: 100%;
            height: 100%;
            display: inline-block;
          }
          &:hover{
            background: rgba(167, 154, 154, 0.1);
            a{
              color: #FE8C00;
            }
          }
        }
      }
      .home-links{
        width: 100%;
        position: absolute;
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 16px;
        font-weight: bold;
        bottom: 15px;
        a{
          color: #222;
        }
        span:nth-of-type(1) a:hover,span:nth-of-type(4) a:hover{
          color: $main-color;
        }
        span:nth-of-type(2) a:hover,span:nth-of-type(3) a:hover,span:nth-of-type(6) a:hover{
          color: #ed1e24;
        }
        span:nth-of-type(5) a:hover{
          color: #FE8C00;
        }
      }
    }
  }
  img{
    width: 125px;
  }
}
</style>
