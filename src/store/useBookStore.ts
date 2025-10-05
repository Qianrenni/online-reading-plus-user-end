import {defineStore} from "pinia";
import type {Book, Catalog} from "../types";
import {useApiBooks} from "../api/books.ts";
import { useMessage } from "qyani-components";

export const useBookStore = defineStore('book', {
    state: () => ({
        books: [] as Book[],
        total:-1,
        cursor:0,
        count:10,
        loading:false,
        book:null as Book|null,
        catalog:null as Catalog[]|null,
    }),
    getters: {
        getBooks: (state) => state.books,
    },
    actions: {
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
                this.books.push(...data!);
                this.cursor+=this.count;
            }else{
                useMessage.error(message);
            }
            this.loading = false;
        },
        async getBookById(id:number):Promise<Book>{
            const index = this.books.findIndex(book=>book.id===id);
            if(index>=0){
                this.book = this.books[index];
                return this.books[index];
            }
            const {success,data} = await useApiBooks.getBookById(id);
            if(success){
                this.books.push(data!);
                this.book = data!;
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
            if(this.catalog&&this.book?.id===id){
                return this.catalog;
            }
            const {success,data} = await useApiBooks.getCatalogById(id);
            if(success){
                this.catalog = data!;
                return data!;
            }
            return [];
        }
    }
})