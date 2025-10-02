<script setup lang="ts">
import {useBookStore} from "../store/useBookStore.ts";
import {onBeforeMount, ref} from "vue";
import {useWindow} from "../utils/useWindow.ts";
import BookItem from "../components/BookItem.vue";
import type {QScrollContainer} from "qyani-components";

defineOptions({
  name: 'Home'
});
const bookStore = useBookStore();
const width = ref(window.innerWidth<768?150:200);
useWindow.addResizeHandler((innerWidth,_) => {
  if (innerWidth < 768) {
    width.value = 150;
  } else {
    width.value = 200;
  }
})


onBeforeMount(() => {
  if(bookStore.books.length==0){
    bookStore.addBook();
  }
});
</script>

<template>
  <QScrollContainer
      scoll-y
      ref="home-container"
                    class="container-banner scroll-container home-container" @ended="bookStore.addBook()">
    <BookItem
        v-for="book in bookStore.getBooks" :key="book.id"
        :book="book" :width="width" :height="width"/>
    <QLoading style="height: 100px;" :show="bookStore.loading" class="container-w100" type="skeleton"/>
  </QScrollContainer>
</template>