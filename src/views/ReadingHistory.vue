<template>
    <div class="reading-history-container">
        <div v-for=" histortItem in history " class=" bg-card reading-history-item shadow-black">
            <QLazyImage :src="histortItem.cover" :height="height" :width="width">
            </QLazyImage>
            <div>
                <h3>{{ histortItem.name }}</h3>
                <p>
                    <QIcon icon="User" size="16px"></QIcon>
                    <h5>{{ histortItem.author }}</h5>
                </p>
                <p>{{ histortItem.tags }}</p>
                <p>{{ histortItem.last_read_at }}</p>
                <p>{{ histortItem.last_position }}</p>
            </div>

        </div>
    </div>
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import type { Book, BookReadingProgress } from '../types';
import { useApiBookReadingProgress } from '../api/bookReadingProgress';
import { useApiBooks } from '../api/books';


type HistoryItem = BookReadingProgress & Book;

const history = ref<HistoryItem[]>([] as HistoryItem[]);
const width =ref(96);
const height = ref(144);
onBeforeMount(async () => {
    const {success,data,message} = await useApiBookReadingProgress.get();
    if(success){
        const books = await useApiBooks.getBooksByList(data!.map(item=>item.book_id));
        if(books.success){
            const historyItems = data!.map(item=>({
                ...item,
                ...books.data!.find(book=>book.id===item.book_id)
            }));
            history.value = historyItems as HistoryItem[];
            console.log(historyItems);
        }
    }
})
</script>
<style scoped lang="css">

</style>