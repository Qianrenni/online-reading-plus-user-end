<script setup lang="ts">
import type {Book} from "../types";

defineOptions({
  name: 'BookItem'
})
defineProps<{
  book: Book
}>()
</script>

<template>
  <div class="container-column book-meta" >
    <h4 class="text-one-line">{{book.name}}</h4>
    <h5 class="text-one-line">{{book.author}}</h5>
    <span class="text-one-line tag">{{book.price}}￥</span>
  </div>
</template>

<style scoped lang="css">

</style>