import { post } from "../utils"

export const useApiBookReadingProgress = {
    updateBookReadingProgress:async(bookId:number,chapterId:number,last_position:number=0)=>{
        const {success,data,message} = await post<null>(
            `/user_reading_progress/add`,
            {
                'book_id':bookId,

                'last_chapter_id':chapterId,

                'last_position':last_position
            }
        );
        return {success,data,message};
    }
}