<template>
  <div class="layout-default" style="background:#f8f8f8;">
    <div>
      <my-header></my-header>
    </div>
    <div>
      <nuxt/>
    </div>
    <div>Footer</div>
  </div>
</template>

<script>
import MyHeader from '@/components/public/header/index.vue'
export default {
  components: {
    MyHeader
  }
}
</script>
