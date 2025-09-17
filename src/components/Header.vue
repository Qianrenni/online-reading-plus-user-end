<script setup lang="ts">
import {QIcon, QThemeToggle} from "qyani-components";

defineOptions({
  name: 'Header'
})
</script>

<template>
  <div class="header-container container-align-center bg-card padding-24rem">
    <router-link to="/" class="link-primary hidden-768">
      <h3>在线阅读</h3>
    </router-link>
    <div class="container gap-fourth">
      <div class="header-search">
        <QSearch  />
      </div>
      <div class="container gap-fourth">
        <router-link to="/" class="link-primary container gap-fourth ">
          <QIcon icon="House" size="16" />
          <h4 class="hidden-768">首页</h4>
        </router-link>
        <router-link to="book-store" class="link-primary container gap-fourth ">
          <QIcon icon="Copy" size="16" />
          <h4 class="hidden-768">书城</h4>
        </router-link>
        <router-link to="book-shelf" class="link-primary container gap-fourth ">
          <QIcon icon="History" size="16" />
           <h4 class="hidden-768">历史记录</h4>
        </router-link>
        <router-link to="personal-center" class="link-primary container gap-fourth ">
          <QIcon icon="User" size="16" />
           <h4 class="hidden-768"> 个人中心</h4>
        </router-link>
      </div>
      <QThemeToggle :size="24"/>
    </div>
  </div>
</template>

<style scoped lang="css">

</style>