<template>
  <div class="m-geo">
    <i class="el-icon-location"></i>{{relCity}}
    <nuxt-link class="changeCity" to="/changeCity">切换城市</nuxt-link>
    [香河 廊坊 天津]
  </div>
</template>

<script>
export default {
  computed: {
    positionCity() { // 一开始的
      return this.$store.getters['geo/getPositionCity']
    },
    city() { // 切换后的
      return this.$store.getters['geo/getCity']
    },
    relCity() {
      return this.city ? this.city : this.positionCity
    }
  }
}
</script>

<style lang="css">
</style>