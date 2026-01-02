<script setup lang="ts">
import {useBookStore} from "../store/useBookStore.ts";
import {onActivated, onBeforeMount, onMounted, ref, useTemplateRef, watch} from "vue";
import { useWindowResize } from "qyani-components";
import BookItem from "../components/BookItem.vue";
import {QScrollContainer,QLoading} from "qyani-components";

defineOptions({
  name: 'Home'
});
const bookStore = useBookStore();
const width = ref(window.innerWidth<768?150:200);
const refScrollContainer = useTemplateRef<InstanceType<typeof QScrollContainer>>('home-container');
const selectedCategory = ref('');

useWindowResize.addHandler((innerWidth,_) => {
  if (innerWidth < 768) {
    width.value = 150;
  } else {
    width.value = 200;
  }
})

watch(
  ()=>selectedCategory.value,
  (newValue,_)=>{
    console.log('selectedCategory',newValue);
    bookStore.setCurrentCategory(newValue);
    bookStore.addBookByCategory();
  }
)

onBeforeMount(async () => {
  bookStore.getBookCategory();
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
      ref="home-container"
      scroll-y
      class="container-banner   bg-card scroll-container home-container" 
      @ended="bookStore.addBookByCategory()"
      @scroll="({y}:{y:number})=>bookStore.setScrollTo(y)"
    >
      <div class="  category-container scroll-container">
        <span 
          v-for="value in bookStore.categories" 
          :key="value" 
          class="  mouse-cursor text-secondary category-item"
          :class="[
            { 'active': selectedCategory === value }
          ]"
          @click="selectedCategory = value"
        >
          {{ value }}
        </span>
      </div>
      <BookItem
        v-for="book in bookStore.getCategoryBook"
        :key="book.id"
        :book="book"
        :width="width"
        :height="width"
      />
      <QLoading
        v-for="i in 10"
        :key="i"
        :show="bookStore.loading"
        class=" book-item-skeleton"
        type="skeleton"
      />
    </QScrollContainer>
  </KeepAlive>
</template>