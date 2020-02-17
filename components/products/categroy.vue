<template>
  <div class="categroy-index">
    <div class="types-box">
      <span class="title-text">分类</span>
      <div class="items">
        <el-popover placement="bottom"
                    :title="item.type"
                    width="400"
                    trigger="hover"
                    v-for="(item,index) in types"
                    :disabled="!item.module.length"
                    :key="index"
                    popper-class="popover">
          <div class="popover-content">
            <span v-for="(innerItem,idx) in item.module"
                  :key="idx"
                  v-show="innerItem">
              {{innerItem}}
            </span>
          </div>
          <span slot="reference">
            {{item.type}}<i v-if="item.module.length" class="el-icon-caret-bottom"></i>
          </span>
        </el-popover>
      </div>
    </div>
    <div class="areas-box">
      <span class="title-text">区域</span>
      <div class="items">
        <el-popover placement="bottom"
                    :title="item.type"
                    width="400"
                    trigger="hover"
                    v-for="(item,idx) in areas"
                    :key="idx"
                    :disabled="!item.module.length"
                    popper-class="popover">
          <div class="popover-content">
            <span v-for="(innerItem,index) in item.module"
                  :key="index"
                  v-show="innerItem">
              {{innerItem}}
            </span>
          </div>
          <span slot="reference">
            {{item.type}}<i v-if="item.module.length" class="el-icon-caret-bottom"></i>
          </span>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    areas: {
      type: Array
    },
    types: {
      type: Array
    }
  },
  created() {
    console.log(this.areas)
  }
}
</script>

<style lang="scss" scoped>
.popover{
  .popover-content{
    display: flex;
    flex-wrap: wrap;
    span{
      cursor: pointer;
      display: inline-block;
      margin:5px 10px;
      font-size: 12px;
    }
  }
}
.categroy-index{
  background: #FFFFFF;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  .title-text{
    display: inline-block;
    width: 100px;
  }
  .items{
    display: flex;
    flex: 1;
    color: #666;
    flex-wrap: wrap;
    padding-bottom: 10px;
    border-bottom: 1px solid #E5E5E5;
    span{
      padding: 0 10px;
      margin-right: 10px;
      line-height: 28px;
      cursor: pointer;
    }
  }
  .types-box{
    padding: 15px 20px 0;
    color: #333;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    display: flex;
  }
  .areas-box{
    padding: 15px 20px;
    color: #333;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
     display: flex;
  }
}
</style>