<template>
    <div class="reading-history-container">
        <div 
            v-for=" histortItem in shelfStore.getBookShelf " 
            class=" bg-card reading-history-item shadow-black"
            :key="histortItem.id"
        >
            <QLazyImage :src="histortItem.cover" :height="height" :width="width">
            </QLazyImage>
            <div class="reading-history-item-content">
                <h3 class=" text-one-line ">{{ histortItem.name }}</h3>
                <p class=" container gap-fourth">
                    <QIcon icon="User" size="14px"></QIcon>
                    <h5>{{ histortItem.author }}</h5>
                </p>
                <p class=" container gap-fourth">
                    <QIcon icon="History" size="14px"></QIcon>
                    <p style="display: flex;align-items: baseline;">
                        <h5>最后阅读：</h5>
                        <span class=" text-08rem ">{{ histortItem.last_read_at?.split('T')[0] }}</span>
                    </p>
                </p>
                <div class=" container gap-half" style="align-items: baseline;">
                    <span class="text-08rem">阅读进度</span>
                    <div class=" reading-history-progressbar">
                        <QProgressBar :percent="`${histortItem.last_position!*100/histortItem.total_chapter}px`"/>
                    </div>
                </div>
                <QFormButton  type="button" @click="()=>router.push(`/book-read/${histortItem.id}/${histortItem.last_chapter_id}`)">继续阅读</QFormButton>
            </div>

        </div>
    </div>
</template>
<script setup lang="ts">
import {  onBeforeMount, ref } from 'vue';
import router from '../route';
import { useBookShelfStore } from '../store/useBookShelf';
const width =ref(96);
const height = ref(144);
const shelfStore = useBookShelfStore();
onBeforeMount(async ()=>{
    shelfStore.get();
})
</script>
<style scoped lang="css">

</style>