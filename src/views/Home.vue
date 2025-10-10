<script setup lang="ts">
import {useBookStore} from "../store/useBookStore.ts";
import {onActivated, onBeforeMount, onMounted, ref, useTemplateRef} from "vue";
import {useWindow} from "../utils/useWindow.ts";
import BookItem from "../components/BookItem.vue";
import type {QScrollContainer} from "qyani-components";

defineOptions({
  name: 'Home'
});
const bookStore = useBookStore();
const width = ref(window.innerWidth<768?150:200);
const refScrollContainer = useTemplateRef<InstanceType<typeof QScrollContainer>>('home-container');
useWindow.addResizeHandler((innerWidth,_) => {
  if (innerWidth < 768) {
    width.value = 150;
  } else {
    width.value = 200;
  }
})


onBeforeMount(() => {
    bookStore.addBook();
});
onMounted(() => {
  refScrollContainer.value?.scrollTo({top:bookStore.scrollTo,behavior:'smooth'});
});
onActivated(() => {
  refScrollContainer.value?.scrollTo({top:bookStore.scrollTo,behavior:'smooth'});
});
</script>

<template>
  <KeepAlive>
    <QScrollContainer
      scroll-Y
      ref="home-container"
      class="container-banner scroll-container home-container" 
      @ended="bookStore.addBook()"
      @scroll="({y}:{y:number})=>bookStore.setScrollTo(y)"
      >
    <BookItem
        v-for="book in bookStore.getBooks" :key="book.id"
        :book="book" :width="width" :height="width"/>
    <QLoading style="height: 100px;" :show="bookStore.loading" class="container-w100" type="skeleton"/>
  </QScrollContainer>
  </KeepAlive>
</template>