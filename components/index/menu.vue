<template>
  <div class="wrapper-index">
    <div class="menu-index">
      <dl>
        <dt>
          <span>全部分类</span>
        </dt>
        <dd v-for="(item,index) in $store.state.home.menu"
            :key="index"
            class="menu-item"
            @mouseover="showDetail(index,true)"
            @mouseout="hideDetail">
          <Icon :iconClass="item.type"></Icon>
          <span>{{item.name}}</span>
          <i class="el-icon-arrow-right"></i>
        </dd>
      </dl>
      <div class="detail" v-if="isShowDetail" @mouseover="showDetail" @mouseout="hideDetail">
        <div v-for="(item, index) in currentDetail" :key="index">
          <div class="detail-title">
            <span class="title-text">{{item.title}}</span>
            <span>更多</span>
          </div>
          <div class="detail-items">
            <span v-for="(innerItem, innerIndex) in item.child"
                  :key="innerIndex"
                  class="item-text">
              {{innerItem}}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/base/icon.vue'
let mouseIsEnterd = false
export default {
  components: {
    Icon
  },
  data() {
    return{
      isShowDetail: false,
      currentDetail: []
    }
  },
  computed: {
  },
  methods: {
    showDetail(index,isMenu) {
      if(isMenu) {
        this.currentDetail = this.$store.state.home.menu[index].child
      }
      this.isShowDetail = true
      mouseIsEnterd = true
    },
    hideDetail() {
      mouseIsEnterd = false
      setTimeout(() => {
        if(!mouseIsEnterd) {
          this.isShowDetail = false
        }
      }, 100);
    }
  },
  created() {
    // console.log(this.$store.state.home.menu)
  }
}
</script>

<style lang="scss" scoped>
.wrapper-index{
  width: 100%;
  position: relative;
}
.menu-index{
  width: 100%;
  height: 475px;
  position: absolute;
  top:-50px;
  background: #fff;
  border: 1px solid #E5E5E5;
  color: #646464;
  box-sizing: border-box;
  dt{
    height: 50px;
    line-height: 50px;
    color: #222222;
    font-size: 16px;
    font-weight: bold;
    padding-left: 15px;
    margin-bottom: 5px;
  }
  .menu-item{
    display: flex;
    align-items: center;
    position: relative;
    padding: 2px 12px;
    height: 26px;
    box-sizing: border-box;
    color: #646464;
    font-size: 13px;
    cursor: pointer;
    &:hover{
      color: #222222;
      font-weight: bold;
      background: rgba(255,150,0,0.08);
    }
    span{
      margin-left: 10px;
    }
    .el-icon-arrow-right{
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translate(0,-50%);
    }
  }
}
.detail{
  height: 415px;
  width: 400px;
  background: #fff;
  position: absolute;
  bottom: 0;
  left: 100%;
  padding: 20px;
  box-sizing: border-box;
  color: #666;
  font-size: 12px;
  span{
    cursor: pointer;
  }
  .detail-title{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #DCDFE6;
    align-items: center;
    height: 45px;
    .title-text{
      color: #222222;
      font-size: 16px;
    }
  }
  .item-text{
    display: inline-block;
    margin: 6px 12px 6px 0;
    &:hover{
      color: $main-color;
    }
  }
}
</style>