<template>
  <div
    ref="bookReadContainer"  
    class=" container-w100 scroll-container" 
    style="height: calc(100vh - 2rem);"
  >
    <div 
      class="book-read-container bg-card "
    >
      <QLoading
        v-show="loading"
        style="height: calc( 100vh - 4rem );width: 100%;"
        type="skeleton"
      />
      <div
        v-show="!loading"
        class="book-read-content"
        :style="{
          fontSize: readSettings.fontSize,
          fontFamily: readSettings.fontFamily,
          lineHeight: readSettings.lineHeight,
          letterSpacing: readSettings.letterSpacing,
          color: readSettings.color,
          backgroundColor: readSettings.backgroundColor
        }" 
        @click="shwoBottomSettings=true"
        v-html="content"
      />
      <div class="book-read-sidebar bg-card hidden-768">
        <div
          class=" container-column container-align-center book-read-sidebar-item  "
          @click="currentContentIndex>0?run(computeCatalog[currentContentIndex-1].id):void(0)"
        >
          <QIcon
            icon="Up"
            size="24px"
          />
          <span class=" text-08rem">上一章</span>
        </div>
        <div
          class=" container-column container-align-center book-read-sidebar-item  "
          @click="currentContentIndex<computeCatalog.length-1?run(computeCatalog[currentContentIndex+1].id):void(0)"
        >
          <QIcon
            icon="Down"
            size="24px"
          />
          <span class=" text-08rem">下一章</span>
        </div>
        <div
          class=" container-column container-align-center book-read-sidebar-item  "
          @click="showCatalog = true"
        >
          <QIcon
            icon="Catalog"
            size="24px"
          />
          <span class=" text-08rem">目录</span>
        </div>
        <div class=" container-column container-align-center book-read-sidebar-item ">
          <QIcon
            icon="Setting"
            size="24px"
          />
          <span class=" text-08rem">阅读设置</span>
        </div>
        <div
          class=" container-column container-align-center book-read-sidebar-item "
          @click="router.push(`/book-detail/${book.id}`)"
        >
          <QIcon
            icon="Book"
            size="24px"
          />
          <span class=" text-08rem">书籍详情</span>
        </div>
      </div>
      <QDrawer
        v-model:visible="showCatalog"
        direction="left"
        :close-on-click-overlay="true"
      >
        <div class=" book-read-catalog-container">
          <h3 class=" text-one-line">
            {{ book.name }}
          </h3>
          <p class=" container-space-between">
            <span>目录</span>
            <span 
              class=" mouse-cursor container  gap-half"
              @click="catalogAscOrder=!catalogAscOrder"
            >
              {{ catalogAscOrder ? '升序' : '降序' }}
              <QIcon
                icon="Switch"
                :style="{
                  transform: `rotateZ(90deg) rotateY(${catalogAscOrder ? 0 : 180}deg) `
                }"
                size="16px"
              />
            </span>
          </p>
          <div class="book-read-catalog scroll-container">
            <p
              v-for="item in computeCatalog" 
              :key="item.id"
              class="book-read-catalog-item text-secondary text-one-line mouse-cursor opacity-6-hover"
              :class="[{
                'active-primary':item.id===currentContentId
              }]"
              @click="()=>{
                run(item.id);
                showCatalog=false;
              }"
            >
              {{ item.title }}
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
        <div
          class=" container-space-between container-wrap"
          @click="shwoBottomSettings=false"
        >
          <div
            class=" container-column container-align-center book-read-sidebar-item  "
            @click="currentContentIndex>0?run(computeCatalog[currentContentIndex-1].id):void(0)"
          >
            <QIcon
              icon="Up"
              size="24px"
            />
            <span class=" text-08rem">上一章</span>
          </div>
          <div
            class=" container-column container-align-center book-read-sidebar-item  "
            @click="currentContentIndex<computeCatalog.length-1?run(computeCatalog[currentContentIndex+1].id):void(0)"
          >
            <QIcon
              icon="Down"
              size="24px"
            />
            <span class=" text-08rem">下一章</span>
          </div>
          <div
            class=" container-column container-align-center book-read-sidebar-item  "
            @click="showCatalog = true"
          >
            <QIcon
              icon="Catalog"
              size="24px"
            />
            <span class=" text-08rem">目录</span>
          </div>
          <div class=" container-column container-align-center book-read-sidebar-item ">
            <QIcon
              icon="Setting"
              size="24px"
            />
            <span class=" text-08rem">阅读设置</span>
          </div>
          <div
            class=" container-column container-align-center book-read-sidebar-item "
            @click="router.push(`/book-detail/${book.id}`)"
          >
            <QIcon
              icon="Book"
              size="24px"
            />
            <span class=" text-08rem">书籍详情</span>
          </div>
        </div>
      </QDrawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeMount, ref, useTemplateRef } from 'vue';
import type { Book, Catalog, ReadSettings } from '../types';
import { useBookStore } from '../store';
import router from '../route';
import { applySpacingToHtml, isHtml } from '../utils/useHtmlUtil';
import { useWrapLoad } from '../utils';
import { useThrottle, useWindowResize } from 'qyani-components';
import { useReadingHistoryStore } from '../store/useReadingHistoryStore';
import { QLoading,QIcon,QDrawer } from 'qyani-components';

const bookReadContainer = useTemplateRef<HTMLDivElement>('bookReadContainer');
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
const readingHistoryStore = useReadingHistoryStore();
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

const {loading,run} = useWrapLoad(async (chapterId:number)=>{
    if(currentContentId.value===chapterId){
        return;
    }
    const updateReadingHistory = useThrottle(async ()=>{
        readingHistoryStore.update(book.value.id,chapterId,currentContentIndex.value+1);
    });
    const rawContent = await bookStore.getBookChapterById(chapterId,book.value.id);
    const processedContent = isHtml(rawContent)?rawContent:rawContent.split('\n').map(item=>`<p>&nbsp;&nbsp;&nbsp;&nbsp;${item}</p>`).join('')
    content.value = applySpacingToHtml(processedContent);
    currentContentId.value = chapterId;
    await nextTick();
    bookReadContainer.value?.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    updateReadingHistory();
    
});
onBeforeMount(async () => {
    try{
        const bookId = parseInt(router.currentRoute.value.params.bookId as string);
        const contentId = parseInt(router.currentRoute.value.params.contentId as string);
        book.value.id=bookId;
        if (contentId!==-1){
            const [rawBook,rawCatalog,_] = await Promise.all([
                bookStore.getBookById(bookId),
                bookStore.getCatalogById(bookId),
                run(contentId)
            ]);
            book.value = rawBook;
            catalog.value = rawCatalog;
        }else{
            const [rawBook,rawCatalog] = await Promise.all([
                bookStore.getBookById(bookId),
                bookStore.getCatalogById(bookId),
            ]);
            catalog.value = rawCatalog;
            book.value = rawBook;
            if(catalog.value.length>0){
                run(catalog.value[0].id);
            }
        }
    }catch(e){
        console.log(e);
    }
});
</script>

<style scoped lang="CSS">

</style>