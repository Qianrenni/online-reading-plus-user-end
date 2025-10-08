<template>
    <div class=" container-w100 scroll-container" style="height: calc(100vh - 3.5rem);">
        <div class="book-read-container bg-card scroll-container">
        <QLoading v-show="loading" style="height: calc( 100vh - 4rem );width: 100%;" type="skeleton"/>
        <div v-show="!loading" v-html="content" class="book-read-content" 
        @click="shwoBottomSettings=true"
        :style="{
            fontSize: readSettings.fontSize,
            fontFamily: readSettings.fontFamily,
            lineHeight: readSettings.lineHeight,
            letterSpacing: readSettings.letterSpacing,
            color: readSettings.color,
            backgroundColor: readSettings.backgroundColor
        }"
         />
        <div class="book-read-sidebar bg-card hidden-768">
            <div class=" container-column container-align-center book-read-sidebar-item  "
            @click="currentContentIndex>0?run(computeCatalog[currentContentIndex-1].id):void(0)"
            >
                <QIcon icon="Up" size="24px"/>
                <span class=" text-08rem">上一章</span>
            </div>
            <div class=" container-column container-align-center book-read-sidebar-item  "
            @click="currentContentIndex<computeCatalog.length-1?run(computeCatalog[currentContentIndex+1].id):void(0)"
            >
                <QIcon icon="Down" size="24px"/>
                <span class=" text-08rem">下一章</span>
            </div>
            <div class=" container-column container-align-center book-read-sidebar-item  "
                @click="showCatalog = true"
            >
                <QIcon icon="Catalog" size="24px"/>
                <span class=" text-08rem">目录</span>
            </div>
            <div class=" container-column container-align-center book-read-sidebar-item ">
                <QIcon icon="Setting" size="24px"/>
                <span class=" text-08rem">阅读设置</span>
            </div>
            <div class=" container-column container-align-center book-read-sidebar-item ">
                <QIcon icon="Book" size="24px"/>
                <span class=" text-08rem">加入书架</span>
            </div>
        </div>
        <QDrawer direction="left"
            :close-on-click-overlay="true"
            v-model:visible="showCatalog"
        >
        <div class=" book-read-catalog-container">
            <h3 class=" text-one-line">{{book.name}}</h3>
            <p class=" container-space-between">
                <span>目录</span>
                <span 
                    class=" mouse-cursor container  gap-half"
                    @click="catalogAscOrder=!catalogAscOrder">
                    {{ catalogAscOrder ? '升序' : '降序'}}
                    <QIcon icon="Switch" :style="{
                        transform: `rotateZ(90deg) rotateY(${catalogAscOrder ? 0 : 180}deg) `
                        }"
                        size="16px"
                    >
                    </QIcon>
                </span>
            </p>
            <div class="book-read-catalog scroll-container">
                <p v-for="item in computeCatalog" 
                    class="book-read-catalog-item text-secondary text-one-line mouse-cursor opacity-6-hover"
                    :class="[{
                        'active-primary':item.id===currentContentId
                    }]"
                    @click="()=>{
                        run(item.id);
                        showCatalog=false;
                    }"
                    >
                    {{item.title}}
                </p>
            </div>
        </div>
        </QDrawer>
        <QDrawer 
            :visible="shwoBottomSettings&&isCanShowBottomSettings"
            direction="bottom"
            :close-on-click-overlay="true"
            @close="shwoBottomSettings=false"
        >
            <div class=" container-space-between"
            @click="shwoBottomSettings=false"
            >
                <div class=" container-column container-align-center book-read-sidebar-item  "
                @click="currentContentIndex>0?run(computeCatalog[currentContentIndex-1].id):void(0)"
                >
                    <QIcon icon="Up" size="24px"/>
                    <span class=" text-08rem">上一章</span>
                </div>
                <div class=" container-column container-align-center book-read-sidebar-item  "
                @click="currentContentIndex<computeCatalog.length-1?run(computeCatalog[currentContentIndex+1].id):void(0)"
                >
                    <QIcon icon="Down" size="24px"/>
                    <span class=" text-08rem">下一章</span>
                </div>
                <div class=" container-column container-align-center book-read-sidebar-item  "
                    @click="showCatalog = true"
                >
                    <QIcon icon="Catalog" size="24px"/>
                    <span class=" text-08rem">目录</span>
                </div>
                <div class=" container-column container-align-center book-read-sidebar-item ">
                    <QIcon icon="Setting" size="24px"/>
                    <span class=" text-08rem">阅读设置</span>
                </div>
            </div>
        </QDrawer>
    </div>
    </div>
    
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import type { Book, Catalog, ReadSettings } from '../types';
import { useBookStore } from '../store';
import router from '../route';
import { applySpacingToHtml } from '../utils/useHtmlUtil';
import { useWrapLoad } from '../utils';
import { useWindowResize } from 'qyani-components';
import { useApiBookReadingProgress } from '../api/bookReadingProgress';


const book = ref<Book>({} as Book);
const catalog = ref<Catalog[]>([] as Catalog[]);
const bookStore = useBookStore();
const showCatalog = ref<boolean>(false);
const content = ref<string>('');
const  catalogAscOrder= ref(true);
const currentContentId = ref<number>(-1);
const currentContentIndex= computed(()=>{
    return catalog.value.findIndex(item=>item.id===currentContentId.value);
});
const shwoBottomSettings = ref<boolean>(false);
const isCanShowBottomSettings = ref<boolean>(window.innerWidth<768);
useWindowResize.addHandler((width,_)=>{
    isCanShowBottomSettings.value = width<768;
})
const computeCatalog = computed(( )=>{
    if(catalogAscOrder.value){
        return catalog.value;
    }else{
        return [...catalog.value].reverse();
    }
})
/* Songti SC, SimSun; */
const readSettings = ref<ReadSettings>({
    fontSize: '1rem',
    lineHeight: '3.5rem',
    letterSpacing: '0.1rem',
    fontFamily: 'Arial, PingFangSC-Regular, Microsoft Yahei, "Source Han Serif SC", SimSun',
    color: 'var(--text-color)',
    backgroundColor: 'var(--card-bg)',
});

const {loading,run} = useWrapLoad(async (id:number)=>{
    if(currentContentId.value===id){
        return;
    }
    const rawContent = await bookStore.getBookChapterById(id);
    content.value = applySpacingToHtml(rawContent);
    currentContentId.value = id;
    setTimeout(async ()=>{
        useApiBookReadingProgress.update(book.value.id,id,currentContentIndex.value+1);
    },0);
});
onBeforeMount(async () => {
    try{
        const bookId = parseInt(router.currentRoute.value.params.bookId as string);
        const contentId = parseInt(router.currentRoute.value.params.contentId as string);
        book.value.id=bookId;
        const [rawBook,rawCatalog,_] = await Promise.all([
            bookStore.getBookById(bookId),
            bookStore.getCatalogById(bookId),
            run(contentId)
        ]);
        book.value = rawBook;
        catalog.value = rawCatalog;
    }catch(e){
        console.log(e);
    }
});
</script>

<style scoped lang="CSS">

</style>