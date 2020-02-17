<template>
  <el-row type="flex" justify="center">
    <el-col class="index-wrapper">
      <el-row :gutter="12" style="height:425px;">
        <el-col :span="5" style="height:100%;">
          <Menu/>
        </el-col>
        <el-col :span="14" style="height:100%;">
          2
        </el-col>
        <el-col :span="5" style="height:100%;">
          3
        </el-col>
      </el-row>
      <el-row style="margin-top:40px;">
        <Artistic/>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import Menu from '@/components/index/menu.vue'
import Artistic from '@/components/index/artistic.vue'
export default {
  components: {
    Menu,
    Artistic
  }
}
</script>

<style lang="scss">
.index-wrapper{
  width: 1190px;
}
</style>
