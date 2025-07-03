import { useState, useCallback } from 'react';
import { Book, LoadingState } from '../types/book';
import { OpenLibraryAPI } from '../services/openLibraryApi';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    error: null,
  });
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const searchBooks = useCallback(async (query: string, offset: number = 0) => {
    if (!query.trim()) {
      setBooks([]);
      setTotal(0);
      setHasMore(false);
      return;
    }

    setLoadingState({ isLoading: true, error: null });
    
    try {
      const response = await OpenLibraryAPI.searchBooks(query, 20, offset);
      
      if (offset === 0) {
        setBooks(response.docs);
      } else {
        setBooks(prev => [...prev, ...response.docs]);
      }
      
      setTotal(response.numFound);
      setHasMore(response.docs.length === 20 && (offset + 20) < response.numFound);
      setLoadingState({ isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while searching';
      setLoadingState({ isLoading: false, error: errorMessage });
      if (offset === 0) {
        setBooks([]);
        setTotal(0);
        setHasMore(false);
      }
    }
  }, []);

  const loadMore = useCallback((query: string) => {
    if (!loadingState.isLoading && hasMore) {
      searchBooks(query, books.length);
    }
  }, [books.length, hasMore, loadingState.isLoading, searchBooks]);

  return {
    books,
    loadingState,
    hasMore,
    total,
    searchBooks,
    loadMore,
  };
}