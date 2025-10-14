<template>
    <QScrollContainer
      v-show="!bookSearchStore.loading"
      scroll-Y
      class="container-banner scroll-container home-container" 
      >
    <BookItem
        v-for="book in bookSearchStore.getSearchResult" :key="book.id"
        :book="book" :width="width" :height="width"/>
  </QScrollContainer>
  <QLoading v-show="bookSearchStore.loading" class=" container-w100 loading"  type="skeleton"/>
</template> 
<script setup lang="ts">
import { useScreenSize } from 'qyani-components';
import { useBookSearchStore } from '../store/useBookSearchStore';
import BookItem from '../components/BookItem.vue';
import { computed } from 'vue';

defineOptions({
    name: 'BookSearch'
});
const bookSearchStore = useBookSearchStore();
const isLessThan768 = useScreenSize.getWidth(768);
const width = computed(()=>{
    return isLessThan768.value?150:200;
})
</script>
<style scoped lang="css">

</style>