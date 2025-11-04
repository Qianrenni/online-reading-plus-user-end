<template>
    <div class="book-info-container container-row-768-column">
        <div>
            <div class="book-info-container-center  bg-card shadow-black">
                <QLazyImage :src="book.cover" :width="width" :height="height" class="book-info-cover"/>
                <div class="book-info-meta text-secondary">
                    <h3>{{book.name}}</h3>
                    <p class="container-row-768-column gap-half">
                        <p class=" container-align-center gap-half">
                            <QIcon icon="User" size="16px"/>
                            <h5>{{book.author}}</h5>
                        </p>
                        <p class=" container-align-center  gap-half">
                            <QIcon icon="Calender" size="16px"/>
                            <h5>{{book.created_at.split('T')[0]}}</h5>
                        </p>
                    </p>    
                    <span class="book-info-meta-category">{{ book.category }}</span>
                    <p v-if="book.tags" class=" container gap-fourth container-wrap">
                        <span v-for="tag in book.tags.split(',')" class="book-info-tag">
                            {{ tag }}
                        </span>
                    </p>
                    <p class=" container-wrap gap-half">
                        <p class=" container gap-half">
                            <QIcon icon="Book" size="16px"/>
                            <h5>{{ book.total_chapter }} 章节</h5>
                        </p>
                        <p class=" container gap-half">
                            <QIcon icon="EyeOpen" size="16px"/>
                            <h5>12345阅读</h5>
                        </p>
                        <p class=" container gap-half">
                            <QIcon icon="Star" size="16px"/>
                            <h5>12345收藏</h5>
                        </p>
                    </p>
                </div>
            </div>
            <div class=" container-w100  shadow-black  bg-card   radius-rem">
                <QTab :list="['书籍简介','目录']" class=" container-w100 radius-rem" @select="(index)=>tabIndex=index">
                    bottom
                </QTab>
                <div v-if="tabIndex===0" class="book-info-description text-secondary">
                    <p class="text-secondary">{{book.description}}</p>
                </div>
                <div v-if="tabIndex===1" class="book-info-catalog scroll-container">
                    <p v-for="item in catalog" 
                        :key="item.id"
                        class="book-info-catalog-item text-secondary text-one-line mouse-cursor opacity-6-hover"
                        @click="()=>router.push(`/book-read/${book.id}/${item.id}`)"
                        >
                        {{item.title}}
                    </p>
                </div>
            </div>
        </div>
        <div >
            <div class="radius-half-rem book-info-fast-catalog   bg-card shadow-black">
                <div class=" container-align-center container-space-between ">
                    <div class=" container gap">
                        <QIcon icon="Catalog" size="16px"/>
                        <h4>快速目录</h4>
                    </div>
                    <span class=" text-primary mouse-cursor" @click="showFastCatalog=!showFastCatalog">{{showFastCatalog?'收起':'展开' }}</span>
                </div>
                <div v-show="showFastCatalog" class="book-info-fast-catalog-list scroll-container ">
                    <p 
                    v-for="item in catalog"
                    :key="item.id"
                     class="book-info-fast-catalog-item text-secondary text-one-line  mouse-cursor opacity-6-hover">
                        {{item.title}}
                    </p>
                </div>
            </div>
            <div class="radius-half-rem book-info-fast-catalog  bg-card shadow-black">
                <h4>相关推荐</h4>
                <div v-for="item in relatedBooks"
                    class=" container mouse-cursor"
                    @click="initial(item.id)"
                >
                    <QLazyImage :src="item.cover" :height="96" :width="72" class=" radius-half-rem"/>
                    <div  class="book-info-recommend-item-meta">
                        <p class=" text-secondary">{{item.name}}</p>
                        <p class=" text-description text-08rem  text-two-line">&nbsp;&nbsp;{{item.description}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useBookStore } from '../store';
import type { Book, Catalog } from '../types';
import { onBeforeMount, ref } from 'vue';
import { useWindowResize,QLazyImage,QIcon,QTab } from 'qyani-components';
import { useApiBooks } from '../api/books';
import router from '../route';
import { useShowLoading } from '../utils';
defineOptions({
    name: 'BookInfo'
});
const book = ref<Book>({
    id: 0,
    name: '',
    author: '',
    cover: '',
    description: '',
    category: '',
    tags: '',
    created_at: '',
    total_chapter: 0,
} as  Book);
const catalog = ref<Catalog[]>([] as Catalog[]);
const height = ref(window.innerWidth<768?200:250);
const width = ref(window.innerWidth<768?150:200);
useWindowResize.addHandler((innerWidth,_)=>{
    if(innerWidth<768){
        width.value = 150;
        height.value = 200;
    }else{
        width.value = 200;
        height.value = 250;
    }
});
const tabIndex = ref(0);
const showFastCatalog = ref(false);
const bookStore = useBookStore();
const relatedBooks = ref([] as Book[]);

const initial =async (bookId: number)=> {
    useShowLoading.show();
    const [rawbook,rawcatalog] =await Promise.all([
        bookStore.getBookById(bookId),
        bookStore.getCatalogById(bookId),
    ]);
    book.value = rawbook;
    catalog.value = rawcatalog;
    useApiBooks.getRecommendBook(book.value.tags.split(',').join(' '))
    .then((result)=>{
        relatedBooks.value = result.data!.filter((item)=>item.id!==bookId);
    })
    useShowLoading.hide();
} 
onBeforeMount(()=>{
    const bookId = parseInt(router.currentRoute.value.params.id as string);
    initial(bookId);
});
</script>

<style scoped lang="css">

</style>