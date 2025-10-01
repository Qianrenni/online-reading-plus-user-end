import {defineStore} from "pinia";
import type {Book} from "../types";
import {useApiBooks} from "../api/books.ts";

export const useBookStore = defineStore('book', {
    state: () => ({
        books: [] as Book[],
        count:20,
        cursor:0,
        loading:false
    }),
    getters: {
        getBooks: (state) => state.books,
    },
    actions: {
        addBook() {
            const {data} =  useApiBooks.getTotalBookCount();
            // if (this.cursor === null || this.loading){
            //     return ;
            // }
            // this.loading = true;
            // useApiBooks.getBooks(this.count, this.cursor).then(res => {
            //     const {books, cursor} = res;
            //     this.books = [...this.books, ...books];
            //     this.cursor = cursor;
            //     this.loading = false;
            // }).catch(error=>{
            //     this.loading = false;
            //     console.log(error);
            // })
        }
    }
})