import { del, get, post } from "../utils"

export const useApiBookShelf  = {
    add:async (bookId:number)=>{
        const {success,data,message} = await post(
            `/shelf/add`,
            {
                'book_id':bookId
            }
        );
        return {success,data,message}
    },
    get:async ():Promise<
        {
            success:boolean;
            data:{book_id:number;created_at:string}[]|null;
            message:string|null;
        }>=>{
        const {success,data,message} = await get<{
            book_id:number;
            created_at:string;
        }[]>(
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