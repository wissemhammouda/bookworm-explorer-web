import { Book, BookDetail, SearchResponse } from '../types/book';

const BASE_URL = 'https://openlibrary.org';
const COVERS_URL = 'https://covers.openlibrary.org/b';

export class OpenLibraryAPI {
  static async searchBooks(query: string, limit: number = 20, offset: number = 0): Promise<SearchResponse> {
    const encodedQuery = encodeURIComponent(query);
    const url = `${BASE_URL}/search.json?q=${encodedQuery}&limit=${limit}&offset=${offset}&fields=key,title,author_name,first_publish_year,cover_i,isbn,subject,publisher,number_of_pages_median`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  }

  static async getBookDetails(bookKey: string): Promise<BookDetail> {
    // Remove '/works/' prefix if present
    const cleanKey = bookKey.replace('/works/', '');
    const url = `${BASE_URL}/works/${cleanKey}.json`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch book details: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // If authors are in detailed format, fetch author names
    if (data.authors && Array.isArray(data.authors)) {
      const authorPromises = data.authors.map(async (authorRef: any) => {
        if (authorRef.author && authorRef.author.key) {
          try {
            const authorResponse = await fetch(`${BASE_URL}${authorRef.author.key}.json`);
            if (authorResponse.ok) {
              const authorData = await authorResponse.json();
              return authorData.name || 'Unknown Author';
            }
          } catch (error) {
            console.warn('Failed to fetch author details:', error);
          }
        }
        return 'Unknown Author';
      });
      
      const authorNames = await Promise.all(authorPromises);
      data.author_name = authorNames;
    }
    
    return data;
  }

  static getCoverUrl(coverId: number | undefined, size: 'S' | 'M' | 'L' = 'M'): string | null {
    if (!coverId) return null;
    return `${COVERS_URL}/id/${coverId}-${size}.jpg`;
  }

  static getAuthorUrl(authorKey: string): string {
    return `${BASE_URL}/authors/${authorKey}.json`;
  }

  static formatAuthors(authors?: string[]): string {
    if (!authors || authors.length === 0) return 'Unknown Author';
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
    return `${authors[0]} & ${authors.length - 1} others`;
  }

  static extractDescription(description?: string | { value: string }): string {
    if (!description) return '';
    if (typeof description === 'string') return description;
    return description.value || '';
  }
}