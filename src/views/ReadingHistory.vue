<template>
    <div class="reading-history-container">
        <div class=" container-w100 container-column gap-half  hidden-768">
            <q-form-button class=" button-outline" style="width: fit-content;"
             @click="showClose=!showClose"
            >
                批量管理
            </q-form-button>
            <hr/>
        </div>
        <div class=" container-w100 container-wrap gap">
            <SwiperAction v-for=" histortItem in historyStore.getReadingHistory " 
                :key="histortItem.id"
                :disabled="!isLessThan768"
                :threshold="30"
            >
                <div  class=" bg-card reading-history-item shadow-black">
                    <div class="inner-close" v-show="showClose&&!isLessThan768"
                    @click="historyStore.delete(histortItem.id)"
                    >
                        <q-icon icon="Close" size="16px" style="color: var(--primary-color);"/>
                    </div>
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
                                <span class=" text-08rem ">{{ histortItem.last_read_at.split('T')[0] }}</span>
                            </p>
                        </p>
                        <div class=" container gap-half" style="align-items: baseline;">
                            <span class="text-08rem">阅读进度</span>
                            <div class=" reading-history-progressbar">
                                <QProgressBar :percent="`${histortItem.last_position*100/histortItem.total_chapter}px`"/>
                            </div>
                        </div>
                        <div class=" container-space-between">
                            <QFormButton  type="button" @click="router.push(`/book-read/${histortItem.book_id}/${histortItem.last_chapter_id}`)">继续阅读</QFormButton>
                            <QFormButton  type="button" v-if="!shelfIds.includes(histortItem.book_id)" class=" button-outline" @click="shelfStore.add(histortItem.book_id)"  >加入书架</QFormButton>
                        </div>
                    </div>
                </div>
                <template #action>
                    <div class=" show-768 padding-46rem container-align-center container-h100 delete-768"
                        @click="historyStore.delete(histortItem.id)"
                    >
                        删除
                    </div>
                </template>
            </SwiperAction>
        </div>
    </div>
</template>
<script setup lang="ts">
import {  computed, onBeforeMount, ref } from 'vue';
import router from '../route';
import { useReadingHistoryStore } from '../store/useReadingHistoryStore';
import { useBookShelfStore } from '../store/useBookShelf';
import { useWindowResize } from 'qyani-components';
import SwiperAction from '../components/SwiperAction.vue';
const width =ref(96);
const height = ref(144);
const isLessThan768 = ref(window.innerWidth<768);
useWindowResize.addHandler((width,_)=>{
    isLessThan768.value = width<768;
});
const showClose = ref(false);
const historyStore = useReadingHistoryStore();
const shelfStore = useBookShelfStore();
const shelfIds = computed(()=>{
    return shelfStore.getBookShelf.map(item =>item.id);
})
onBeforeMount(async ()=>{
    historyStore.get();
})
</script>
<style scoped lang="css">

</style>