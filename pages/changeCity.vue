<template>
  <el-row type="flex" justify="center">
    <el-col class="city-index">
      <div class="city-area">
        <span class="flag-text">按省份选择：</span>
        <el-select v-model="pvalue" placeholder="省份" style="margin-right:20px;">
          <el-option v-for="(item,index) in provinces"
                     :key="index"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
        <el-select :disabled="!citys.length" v-model="cvalue" placeholder="城市" style="margin-right:60px;">
          <el-option v-for="(item,index) in citys"
                     :key="index"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <span class="flag-text">直接搜索：</span>
        <el-autocomplete
          v-model="inputCity"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入城市中文或拼音"
          @select="handleSelect"
        ></el-autocomplete>
      </div>
      <div class="hot-city">
        <span class="flag-text">热门城市：</span>
        <span class="hot-city-text"
              v-for="(item, index) in hotCitys"
              :key="index"
              @click="changeHotCity(item)">{{item}}</span>
      </div>
      <div class="alphabet-box">
        <span class="flag-text">按拼音首字母选择：</span>
        <span v-for="item in alphabetList" :key="item">
          <a class="alphabet-text" :href="'#city-'+item">{{item}}</a>
        </span>
      </div>
      <div>
        <div v-for="item in block" :key="item.title" class="cities-area">
          <div :id="'city-' + item.title" class="city-title">{{item.title}}</div>
          <div class="cities-box">
            <span @click="changeCity(c)" v-for="c in item.city" :key="c">{{c}}</span>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import _ from 'loadsh'
import pyjs from 'js-pinyin' // 中文转拼音插件
var _this;
export default {
  data() {
    return {
      pvalue: '', // 选择的省份
      provinces: [], // 省份
      cvalue: '',  // 选择的城市
      citys: [],  // 当前选择的省份的城市列表
      inputCity: '', // 选择的城市，为远程搜索的
      cities: [],  // 全国的城市
      hotCitys: ['北京', '上海', '广州', '深圳', '天津', '西安', '重庆', '杭州', '南京', '武汉', '成都'],
      alphabetList: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      block: [] // 按字母分类的城市
    }
  },
  watch: {
    async pvalue(newPvalue) {
      let {status, data:{city}} = await this.$axios.get(`/geo/province/${newPvalue}`)
      if(status === 200) {
        this.citys = city.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        })
      }
      this.cvalue = '' // 清空上一次选择的城市
    },
    cvalue(newCvalue) {
      let city = this.citys.filter((item) => {return item.value === newCvalue})
      let cityName = city[0].label
      if(cityName === "市辖区") {
        let province = this.provinces.filter((item) => {return item.value === this.pvalue})
        cityName = province[0].label
      }
      let data = {
        city: cityName
      }
      this.$store.commit('geo/setPosition', data)
      this.$router.push('/')
    }
  },
  methods: {
    /**
     * query为用户输入的内容
     * cb为回调函数,把符合条件的数据返回
     */
    querySearchAsync: _.debounce(async (query, cb) => {
      if (_this.cities.length) {
        let results = _this.cities.filter((item) => {return item.value.indexOf(query) > -1})
        cb(results)
      } else {
        let {status, data: {city}} = await _this.$axios.get('/geo/city')
        if(status === 200) {
          _this.cities = city.map((item) => {
            return {
              value: item.name
            }
          })
          let results = _this.cities.filter((item) => {return item.value.indexOf(query) > -1})
          cb(results)
        } else {
          cb([])
        }
      }
    }, 200),
    handleSelect() {
      let data = {
        city: this.inputCity
      }
      this.$store.commit('geo/setPosition', data)
      this.$router.push('/')
    },
    // 获取省份
    async getProvinces() {
      let {status, data: {provinces}} = await this.$axios.get('/geo/provinces')
      if(status === 200) {
        this.provinces = provinces.map((item) => {
          return {
            value: item.id,
            label: item.name
          }
        })
      }
    },
    // 获取按字母分类的城市数据
    async getBlock() {
      let blocks = []
      let {status, data: {city}} = await this.$axios.get('/geo/city')
      if(status === 200) {
        let p // 保存首字母的变量
        let c // 保存首字母变成code值的变量
        let d = {} // 保存完成数据的变量,格式为{a:[],b:[]...}
        city.forEach((item) => {
          // getFullChars为插件把中文转成拼音的方法
          p = pyjs.getFullChars(item.name).toLocaleLowerCase().slice(0, 1)
          c = p.charCodeAt(0)
          if(c > 96 && c < 123){ // 小写字母的范围
            if(!d[p]) {
              d[p] = []
            }
            d[p].push(item.name)
          }
        })
        // 转为数组
        for(let [k, v] of Object.entries(d)) {
          blocks.push({
            title: k.toUpperCase(),
            city: v
          })
        }
        // 排序
        blocks.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
        this.block = blocks
      }
    },
    // 选择热门城市
    async changeHotCity(city) {
      // this.$store.commit('geo/setCity', city + '市')
      this.$store.dispatch('geo/setCity', city + '市')
      const {status: status2, data: {result}} = await this.$axios.get('/search/hosPlace',{
        params: {
          city: this.$store.state.geo.city.replace('市', '')
        }
      })
      this.$store.dispatch('home/setHotPlace', result)
      this.$router.push('/')
    },
    // 通过下面的城市列表点击跳转
    async changeCity(city) {
      this.$store.dispatch('geo/setCity', city)
      const {status: status2, data: {result}} = await this.$axios.get('/search/hosPlace',{
        params: {
          city: this.$store.state.geo.city.replace('市', '')
        }
      })
      this.$store.dispatch('home/setHotPlace', result)
      this.$router.push('/')
    }
  },
  mounted() {
    this.getProvinces()
    this.getBlock()
  },
  created() {
    _this = this
  }
}
</script>

<style lang="scss" scoped>
.city-index{
  width: 1190px;
  box-sizing: border-box;
  margin: 20px auto 0;
  background-color: #fff;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  min-height: 1000px;
  padding: 20px;
  .flag-text{
    font-size: 16px;
    color: #333;
    font-weight: 500;
  }
  .city-area{
    border-bottom: 1px solid #E5E5E5;
    padding-bottom: 30px;
    display: flex;
    align-items: center;
  }
  .hot-city{
    border-bottom: 1px solid #E5E5E5;
    padding: 30px 0;
    display: flex;
    align-items: center;
    .hot-city-text{
      display: inline-block;
      margin: 0 20px;
      color: #666;
      font-size: 14px;
      cursor: pointer;
      &:hover{
        color: #222222;
        font-weight: 500;
      }
    }
  }
  .alphabet-box{
    padding: 30px 0;
    display: flex;
    align-items: center;
    .alphabet-text{
      font-size: 15px;
      color: #666;
      display: inline-block;
      margin: 0 5px;
      width: 25px;
      height: 25px;
      line-height: 25px;
      cursor: pointer;
      box-sizing: border-box;
      text-align: center;
      border-radius: 50%;
      &:hover{
        font-weight: 500;
        color: #222222;
        background: #f8f8f8;
      }
    }
  }
  .cities-area{
    padding: 13px 30px 13px 10px;
    border-radius: 10px;
    transition: background-color 500ms;
    display: flex;
    flex-wrap: wrap;
    &:hover{
      background: #f8f8f8;
    }
    .city-title{
      box-sizing: border-box;
      vertical-align: top;
      padding-top: 10px;
      display: inline-block;
      text-align: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      color: #222222;
      background: #FFD000;
    }
    .cities-box{
      flex: 1;
      span{
        margin: 10px 20px;
        display: inline-block;
        color: #666;
        font-size: 14px;
        cursor: pointer;
        &:hover{
          color: #222222;
          font-weight: 500;
        }
      }
    }
  }
}
</style>