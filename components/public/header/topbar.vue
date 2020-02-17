<template>
  <el-row class="m-header">
    <el-col :span="6">
      <geo/>
    </el-col>
    <el-col :span="6">
      <user/>
    </el-col>
    <el-col :span="12">
      <my-nav></my-nav>
    </el-col>
  </el-row>
</template>

<script>
import Geo from './geo.vue'
import User from './user.vue'
import MyNav from './nav.vue'
export default {
  components: {
    Geo,
    User,
    MyNav
  }
}
</script>

<style lang="sass">
@import "@/assets/css/public/header/index.scss";
</style>