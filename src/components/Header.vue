<script setup lang="ts">
import {QIcon, QThemeToggle} from "qyani-components";

defineOptions({
  name: 'Header'
})
</script>

<template>
  <div class="container container-space-between bg-card padding-24rem">
    <router-link to="/" class="link-primary">
      <h5>在线阅读</h5>
    </router-link>
    <div class="container gap">
      <div class="container gap-fourth">
        <router-link to="book-store" class="link-primary container gap-fourth ">
          <QIcon icon="Copy" size="16" />
          书城
        </router-link>
        <router-link to="book-shelf" class="link-primary container gap-fourth ">
          <QIcon icon="History" size="16" />
          历史记录
        </router-link>
        <router-link to="personal-center" class="link-primary container gap-fourth ">
          <QIcon icon="User" size="16" />
          个人中心
        </router-link>
      </div>
      <QThemeToggle :size="24" class=""/>
    </div>
  </div>
</template>

<style scoped lang="css">

</style>