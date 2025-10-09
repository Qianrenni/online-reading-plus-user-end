import { del, get, post } from "../utils"

export const useApiBookShelf  = {
    add:async (bookId:number)=>{
        const {success,data,message} = await post(
            `/shelf/add`,
            {
                bookId
            }
        );
        return {success,data,message}
    },
    get:async ()=>{
        const {success,data,message} = await get(
            `/shelf/get`,
        );
        return {success,data,message}   
    },
    delete:async (bookId:number)=>{
        const {success,data,message} = await del(
            `/shelf/delete/${bookId}`
        )
        return {success,data,message}
    }
}