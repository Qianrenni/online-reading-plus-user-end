<template>
  <div>
    <SwiperAction 
    >
      <!-- 默认内容 -->
      <div style="padding: 16px; background: #fff; border: 1px solid #eee;">
        这是可滑动的列表项
      </div>

      <!-- 滑动后显示的操作区域 -->
      <template #action>
        <button 
          style="width: 100px; height: 100%; background: red; color: white;"
          @click="deleteItem"
        >
          删除
        </button>
      </template>
      <!-- 滑动后显示的操作区域 -->
      <template #action-left>
        <button 
          style="width: 100px; height: 100%; background: red; color: white;"
          @click="deleteItem"
        >
          删除
        </button>
      </template>
    </SwiperAction>
  </div>
</template>

<script setup lang="ts">
import SwiperAction from '../components/SwiperAction.vue'

const deleteItem = () => {
  alert('删除操作')
}
</script>