import { Book } from '../types/book';
import { BookCard } from './BookCard';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface BookGridProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  onLoadMore?: () => void;
  hasMore: boolean;
  isLoading: boolean;
  total: number;
}

export function BookGrid({ books, onBookClick, onLoadMore, hasMore, isLoading, total }: BookGridProps) {
  if (books.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {books.length} of {total.toLocaleString()} results
        </p>
      </div>

      {/* Books Grid */}
      <div className="grid gap-6 md:gap-8">
        {books.map((book, index) => (
          <div
            key={`${book.key}-${index}`}
            style={{
              animationDelay: `${Math.min(index * 0.1, 1)}s`
            }}
          >
            <BookCard
              book={book}
              onClick={() => onBookClick(book)}
            />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center mt-12">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="px-8 py-3 rounded-xl border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Loading...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ChevronDown className="w-4 h-4" />
                Load More Books
              </div>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}