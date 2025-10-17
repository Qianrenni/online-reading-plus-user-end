import {defineStore} from "pinia";
import type {Book, Catalog} from "../types";
import {useApiBooks} from "../api/books.ts";
import { shareMemoryCache, useMessage } from "qyani-components";

const cache =  shareMemoryCache;
export const useBookStore = defineStore('book', {
    state: () => ({
        books: new Map<number,Book>(),
        total:-1,
        cursor:0,
        count:10,
        loading:false,
        scrollTo:0,
    }),
    getters: {
        getBooks: (state) => Array.from(state.books.values()),
        getScrollTo: (state) => state.scrollTo,
    },
    actions: {
        setScrollTo(scrollTo:number){
            this.scrollTo = scrollTo;
        },
        async addBook() {
            if(this.total<0){
                const {success,data,message} =  await useApiBooks.getTotalBookCount();
                if(success){
                    this.total = data!;
                }else{
                    useMessage.error(message);
                    return;
                }
            }
            if(this.cursor>=this.total){
                useMessage.info('没有更多书籍了');
                return;
            }
            if(this.loading){
                return;
            }
            this.loading = true;
            const {success,data,message} = await useApiBooks.getBooksByList(Array.from({length:this.count},(_,i)=>this.cursor+i+1));
            if(success){
                data!.forEach(book=>this.books.set(book.id,book));
                this.cursor+=this.count;
            }else{
                useMessage.error(message);
            }
            this.loading = false;
        },
        async getBookById(id:number):Promise<Book>{
            const key = `book_${id}`;
            if (cache.has(key)){
                return cache.get(key)!
            }
            const isFinded = this.books.has(id);
            if(isFinded){
                cache.set(key,this.books.get(id)!);
                return this.books.get(id)!
            }
            const {success,data} = await useApiBooks.getBookById(id);
            if(success){
                this.books.set(id,data!);
                cache.set(key,data!);
                return data!;
            }
            return {
                id:0,
                name:'',
                author:'',
                cover:'',
                description:'',
            } as Book
        },
        async getCatalogById(id:number):Promise<Catalog[]>{
            const key = `catalog_${id}`;
            if (cache.has(key)){
                return cache.get(key)!
            }
            const {success,data} = await useApiBooks.getCatalogById(id);
            if(success){
                cache.set(key,data!);
                return data!;
            }
            return [];
        },
        async getBookChapterById(id:number){
            const {data} = await useApiBooks.getBookChapterById(id);
            return data||''
        },
        async getBookByList(book_ids:number[]){
            const booksFinded = [] as Book[];
            const booksNotFinded = [] as number[];
            for(const bookId of book_ids){
                if (this.books.has(bookId)){
                    booksFinded.push(this.books.get(bookId)!);
                }else if(cache.has(`book_${bookId}`)){
                    booksFinded.push(cache.get(`book_${bookId}`)!);
                }else{
                    booksNotFinded.push(bookId);
                }
            }
            if(booksNotFinded.length>0){
                const {success,data,message} = await useApiBooks.getBooksByList(booksNotFinded);
                if(success){
                    data!.forEach(book=>this.books.set(book.id,book));
                    data!.forEach(book=>cache.set(`book_${book.id}`,book));
                    booksFinded.push(...data!);
                }else{
                    console.error(message);
                }
            }
            return booksFinded;
        }
    }
})