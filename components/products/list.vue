<template>
  <div class="list-index">
    <div class="content-item"
        v-for="(item,index) in list"
        :key="index">
      <img :src="item.img" alt="">
      <div class="item-info">
        <div class="item-title">{{item.name}}</div>
        <div class="item-type">{{item.type}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.list-index{
  box-sizing: border-box;
  width: 100%;
  background: #FFFFFF;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  color: #333;
  font-size: 14px;
  line-height: 20px;
  margin-top: 10px;
  padding: 11px 20px;
  box-sizing: border-box;
  .content-item{
    margin-bottom: 20px;
    display: flex;
    img{
      width: 220px;
      height: 125px;
    }
    .item-info{
      margin-left: 20px;
      .item-title{
        font-weight: 500;
        color: #333;
        font-size: 16px;
        margin-bottom: 20px;
      }
      .item-type{
        font-size: 12px;
        color: #666;
      }
    }
  }
}
</style>