import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '../types/book';
import { useBooks } from '../hooks/useBooks';
import { SearchBar } from '../components/SearchBar';
import { BookGrid } from '../components/BookGrid';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { BookOpen, Sparkles } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { books, loadingState, hasMore, total, searchBooks, loadMore } = useBooks();

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    searchBooks(query);
  }, [searchBooks]);

  const handleBookClick = (book: Book) => {
    // Navigate to book detail page with the book data
    const bookKey = book.key.replace('/works/', '');
    navigate(`/book/${bookKey}`, { state: { book } });
  };

  const handleLoadMore = () => {
    loadMore(searchQuery);
  };

  const handleRetry = () => {
    searchBooks(searchQuery);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-xl">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Open Library Explorer
            </h1>
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          
          <SearchBar
            onSearch={handleSearch}
            isLoading={loadingState.isLoading}
            placeholder="Search for books, authors, or subjects..."
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loadingState.error ? (
          <ErrorMessage 
            message={loadingState.error} 
            onRetry={handleRetry}
          />
        ) : loadingState.isLoading && books.length === 0 ? (
          <LoadingSpinner />
        ) : books.length === 0 ? (
          <EmptyState 
            type={searchQuery ? 'no-results' : 'initial'} 
            query={searchQuery}
          />
        ) : (
          <BookGrid
            books={books}
            onBookClick={handleBookClick}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isLoading={loadingState.isLoading}
            total={total}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            Powered by{' '}
            <a 
              href="https://openlibrary.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-glow transition-colors underline"
            >
              Open Library
            </a>
            {' '}- A project of the Internet Archive
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
