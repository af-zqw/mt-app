<template>
  <div class="index">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">{{ city }}美团</el-breadcrumb-item>
      <el-breadcrumb-item>{{ city }}{{keyword}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    keyword: {
      type: String
    }
  },
  computed: {
    city() {
      return this.$store.state.geo.city ? this.$store.state.geo.city.replace('市','') : this.$store.state.geo.position.city.replace('市','')
    }
  }
}
</script>

<style lang="scss" scoped>
.index{
  margin: 10px 0;
  color: #222;
}
</style>