import { BookOpen, Search } from 'lucide-react';

interface EmptyStateProps {
  type: 'initial' | 'no-results';
  query?: string;
}

export function EmptyState({ type, query }: EmptyStateProps) {
  if (type === 'initial') {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Discover Amazing Books
        </h2>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Search through millions of books from the Open Library. Find your next great read by title, author, or subject.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
        <Search className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        No Books Found
      </h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        We couldn't find any books matching "{query}". Try searching with different keywords or check your spelling.
      </p>
    </div>
  );
}