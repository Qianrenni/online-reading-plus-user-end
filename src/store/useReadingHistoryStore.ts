import {defineStore} from 'pinia'
import type { BookReadingProgress } from '../types';

export const useReadingHistoryStore = defineStore('readingHistory', {
    state: () => ({
        readingHistory:[] as BookReadingProgress[]
    })

});