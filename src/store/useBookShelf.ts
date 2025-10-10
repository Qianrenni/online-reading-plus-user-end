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
            if (this.bookShelf.length>0){
                return
            }
            const {success,data} = await useApiBookShelf.get();
            if(success&&data!.length>0){
                const bookStore = useBookStore();
                const readingHistoryStore = useReadingHistoryStore();
                const books = await bookStore.getBookByList(data!.map(item=>item.book_id));
                const historyItems = (await Promise.all(data!.map(item=>readingHistoryStore.getSingle(item.book_id)))).filter(item=>item!==undefined);
                const shelfItems = data!.map(item=>({
                    ...item,
                    ...books.find(book=>book.id===item.book_id),
                    ...historyItems.find(historyItem=>historyItem.book_id===item.book_id)??{
                        last_chapter_id:-1,
                        last_position:0,
                        last_read_at:''
                    }
                }));
                console.log(shelfItems);
                this.bookShelf = shelfItems as ShelfItem[];
            }
        },
        async add(bookId:number){
            const bookStore = useBookStore();
            const readingHistoryStore = useReadingHistoryStore();
            const [responseAdd,book,history] =  await Promise.all([
               useApiBookShelf.add(bookId),
               bookStore.getBookById(bookId),
               readingHistoryStore.getSingle(bookId)
            ]);
            
            if(responseAdd.success){
                this.bookShelf.unshift({
                    ...book,
                    ...history??{
                        last_chapter_id:-1,
                        last_position:0,
                        last_read_at:''
                    }
                } as ShelfItem);
            }
        },
        isInShelf(bookId:number){
            return this.bookShelf.findIndex(item=>item.book_id===bookId)!==-1;
        }


    }
})