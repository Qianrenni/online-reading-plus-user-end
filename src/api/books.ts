import type {Book, Catalog} from "../types";
import { get } from "../utils";

export const useApiBooks = {
    getBooksByList: async (book_ids: number[]) => {
        let url = `/book/list?${book_ids.map(id=>`book_ids=${id}`).join('&')}`;
        const {success,data,message} = await get<Book[]>(url);
        return {success,data,message};
    },
    getTotalBookCount:async()=>{
        const  {success,data,message} = await get<{total:number}>('/book/total');
        return {success,data:data?.total,message};
    },
    getBookById:async(id:number)=>{
        const {success,data,message} = await get<Book>(`/book/${id}`,undefined,true);
        return {success,data,message};
    },
    getCatalogById:async(id:number)=>{
        const {success,data,message} = await get<Catalog[]>(`/book/toc/${id}`,undefined,true);
        return {success,data,message};
    },
    getBookChapterById:async(id:number)=>{
        const {success,data,message} = await get<string>(`/book/chapter/${id}`,undefined,true);
        return {success,data,message};
    }
}