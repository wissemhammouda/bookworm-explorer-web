import { Book } from '../types/book';
import { OpenLibraryAPI } from '../services/openLibraryApi';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, BookOpen } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

export function BookCard({ book, onClick }: BookCardProps) {
  const coverUrl = OpenLibraryAPI.getCoverUrl(book.cover_i, 'M');
  const authors = OpenLibraryAPI.formatAuthors(book.author_name);

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 bg-card border-border rounded-xl overflow-hidden animate-fade-in"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex gap-4 p-6">
          {/* Book Cover */}
          <div className="flex-shrink-0">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={`Cover of ${book.title}`}
                className="w-20 h-28 object-cover rounded-lg shadow-book group-hover:shadow-lg transition-shadow duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-20 h-28 bg-muted rounded-lg flex items-center justify-center shadow-book">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {book.title}
            </h3>
            
            <div className="space-y-2 mb-3">
              {book.author_name && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm line-clamp-1">{authors}</span>
                </div>
              )}
              
              {book.first_publish_year && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{book.first_publish_year}</span>
                </div>
              )}
            </div>

            {/* Subjects/Tags */}
            {book.subject && book.subject.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {book.subject.slice(0, 3).map((subject) => (
                  <Badge 
                    key={subject} 
                    variant="secondary" 
                    className="text-xs px-2 py-1 bg-secondary/60 text-secondary-foreground hover:bg-secondary transition-colors"
                  >
                    {subject}
                  </Badge>
                ))}
                {book.subject.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    +{book.subject.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}