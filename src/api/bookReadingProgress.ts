import { type BookReadingProgress } from "../types";
import { del, get, patch } from "../utils"
export const useApiBookReadingProgress = {

    /**
     * 
     * @param bookId 书籍ID
     * @param chapterId 章节ID
     * @param last_position 最后阅读位置
     * @returns {success:boolean,data:null,message:string|null}
     */
    update:async(bookId:number,chapterId:number,last_position:number=0)=>{
        const {success,data,message} = await patch<null>(
            `/user_reading_progress/add`,
            {
                'book_id':bookId,

                'last_chapter_id':chapterId,

                'last_position':last_position
            }
        );
        return {success,data,message};
    },
    get:async():Promise<{
        success:boolean,
        data:BookReadingProgress[]|null,
        message:string|null
    }>=>{
        const {success,data,message} = await get<BookReadingProgress[]>('/user_reading_progress/get')
        return {success,data,message};
    },
    delete:async(bookId:number)=>{
        const {success,data,message} = await del<null>(`/user_reading_progress/delete/${bookId}`)
        return {success,data,message};
    }
}