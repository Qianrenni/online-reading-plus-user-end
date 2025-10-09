
export interface Book {
    cover: string;
    id: number,
    category: string;
    total_chapter:number,
    author: string;
    description: string;
    name: string;
    tags: string;
    created_at: string;
}
export interface User {
    id: number;
    username: string;
    email: string;
    avatar: string;
    is_active: boolean;
}

export interface Catalog {
    id: number;
    title: string;
}

export interface ReadSettings {
    fontSize: string;
    lineHeight: string;
    letterSpacing: string;
    fontFamily: string;
    color: string;
    backgroundColor: string;
}

export interface BookReadingProgress {
    book_id: number;
    last_chapter_id: number;
    last_position: number;
    last_read_at: string;
}
export type ShelfItem = Book & Partial<BookReadingProgress>;