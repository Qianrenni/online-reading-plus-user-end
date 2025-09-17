<script setup lang="ts">
import type {Book} from "../types";

defineOptions({
  name: 'BookItem'
})
defineProps<{
  book: Book;
  width: number;
  height: number;
}>()
</script>

<template>
  <QCard class="book-card">
    <template #default>
      <QLazyImage :src="book.url" class="book-image"  :height="width" :width="width"/>
    </template>
    <template #footer>
      <div class="container-column book-meta margin-rem gap-half" >
        <h4 class="text-one-line">{{book.name}}</h4>
        <h6 class="text-one-line">作者: {{book.author}}</h6>
        <QFormButton>开始阅读</QFormButton>
      </div>
    </template>
  </QCard>

</template>

<style scoped lang="css">

</style>