<template>
  <div>
    <Header/>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>
<script lang="ts" setup>
import Header from './components/Header.vue';
</script>
<style scoped lang="css">

</style>
