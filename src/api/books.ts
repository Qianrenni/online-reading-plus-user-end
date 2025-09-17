import type {Book} from "../types";
import {BASE_URL} from "../config";

export const useApiBooks = {
    getBooks: async (count:number=10,cursor:number): Promise<{ books: Book[], cursor: number,count:number }> => {
        const response = await fetch(`${BASE_URL}/book/books?count=${count}&cursor=${cursor}`);
        return await response.json();
    }
}