<template>
    <div class="reading-history-container">
        <div class=" container-w100 container-column gap-half  hidden-768">
            <q-form-button class=" button-outline  padding-28rem radius-rem" style="width: fit-content;"
             @click="showClose=!showClose"
            >
                批量管理
            </q-form-button>
            <hr/>
        </div>
        <div class=" container-w100 container-wrap gap">
            <QSwiperAction v-for=" histortItem in shelfStore.getBookShelf " 
                :key="histortItem.id"
                :disabled="!isLessThan768"
                :threshold="30"
            >
                <div 
                    class=" bg-card reading-history-item shadow-black"
                >
                    <div 
                        class="inner-close" 
                        v-show="showClose&&!isLessThan768"
                        @click="shelfStore.delete(histortItem.id)"
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
                                <span class=" text-08rem ">{{ histortItem.last_read_at?.split('T')[0] }}</span>
                            </p>
                        </p>
                        <div class=" container gap-half" style="align-items: baseline;">
                            <span class="text-08rem">阅读进度</span>
                            <div class=" reading-history-progressbar">
                                <QProgressBar :percent="`${histortItem.last_position!*100/histortItem.total_chapter}px`"/>
                            </div>
                        </div>
                        <QFormButton  
                            type="button" 
                            @click="()=>router.push(`/book-read/${histortItem.id}/${histortItem.last_chapter_id}`)"
                            class=" button-outline  padding-28rem radius-rem"
                        >
                            <div class=" container-center container-align-center container-w100  ">
                                    <QIcon icon="EyeOpen" size="16px"/>
                                    <span>
                                        继续阅读
                                    </span>
                            </div>
                        </QFormButton>
                    </div>

                </div>
                <template #action>
                    <div class=" show-768 padding-46rem container-align-center container-h100 delete-768"
                        @click="shelfStore.delete(histortItem.id)"
                    >
                        删除
                    </div>
                </template>
            </QSwiperAction>
            
        </div>
    </div>
</template>
<script setup lang="ts">
import {  onBeforeMount, ref } from 'vue';
import router from '../route';
import { useBookShelfStore } from '../store/useBookShelfStore';
import { useWindowResize } from 'qyani-components';
import { QSwiperAction,QIcon,QProgressBar,QFormButton,QLazyImage } from 'qyani-components';
const width =ref(96);
const height = ref(144);
const isLessThan768 = ref(window.innerWidth<768);
const showClose = ref(false);
useWindowResize.addHandler((width,_)    =>{
    isLessThan768.value = width<768;
})
const shelfStore = useBookShelfStore();
onBeforeMount(async ()=>{
    shelfStore.get();
})
</script>
<style scoped lang="css">

</style>