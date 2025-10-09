import { defineStore } from "pinia";
import type { ShelfItem } from "../types";
import { useApiBookShelf } from "../api/bookShelf";
import { useReadingHistoryStore } from "./useReadingHistoryStore";
import { useBookStore } from "./useBookStore";


export const useBookShelfStore= defineStore('bookShelf', {
    state: () => ({
        bookShelf:[] as ShelfItem[]
    }),
    getters:{
        getBookShelf: (state) => state.bookShelf,
    },
    actions:{
        async get(){
            const {success,data} = await useApiBookShelf.get();
            if(success&&data!.length>0){
                const bookStore = useBookStore();
                const readingHistoryStore = useReadingHistoryStore();
                const books = await bookStore.getBookByList(data!.map(item=>item.book_id));
                const historyItems = (await Promise.all(data!.map(item=>readingHistoryStore.getSingle(item.book_id)))).filter(item=>item!==undefined);
                const shelfItems = data!.map(item=>({
                    ...item,
                    ...books.find(book=>book.id===item.book_id),
                    ...historyItems.find(historyItem=>historyItem.book_id===item.book_id)
                }));
                this.bookShelf = shelfItems as ShelfItem[];
            }
        },
        async add(bookId:number){
            await useApiBookShelf.add(bookId);
        },
        isInShelf(bookId:number){
            return this.bookShelf.findIndex(item=>item.book_id===bookId)!==-1;
        }


    }
})