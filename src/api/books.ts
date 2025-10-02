import type {Book} from "../types";
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
    }
}