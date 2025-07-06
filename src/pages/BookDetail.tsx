import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, User, BookOpen, Hash, Building2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookDetail as BookDetailType, Book } from '../types/book';
import { OpenLibraryAPI } from '../services/openLibraryApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export default function BookDetail() {
  const { bookKey } = useParams<{ bookKey: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [bookDetail, setBookDetail] = useState<BookDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the book from location state if available (for immediate display)
  const bookFromState = location.state?.book as Book | undefined;

  useEffect(() => {
    const fetchBookDetail = async () => {
      if (!bookKey) {
        setError('No book specified');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const detail = await OpenLibraryAPI.getBookDetails(bookKey);
        setBookDetail(detail);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load book details';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetail();
  }, [bookKey]);

  const handleBack = () => {
    // Try to go back in history, otherwise navigate to home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner message="Loading book details..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Results
          </Button>
          <ErrorMessage message={error} onRetry={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  const book = bookDetail || bookFromState;
  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message="Book not found" />
        </div>
      </div>
    );
  }

  // Get cover ID from bookDetail.covers array or fallback to book.cover_i
  const coverId = bookDetail?.covers?.[0] || book.cover_i;
  const coverUrl = OpenLibraryAPI.getCoverUrl(coverId, 'L');
  const authors = OpenLibraryAPI.formatAuthors(bookDetail?.author_name || book.author_name);
  const description = OpenLibraryAPI.extractDescription(bookDetail?.description);
  const publishYear = bookDetail?.first_publish_year || book.first_publish_year;
  const allISBNs = [...(book.isbn || []), ...(bookDetail?.isbn_10 || []), ...(bookDetail?.isbn_13 || [])];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          onClick={handleBack}
          variant="ghost"
          className="mb-6 gap-2 hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Results
        </Button>

        <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden shadow-elegant">
              <CardContent className="p-6">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={`Cover of ${book.title}`}
                    className="w-full max-w-sm mx-auto rounded-lg shadow-book"
                  />
                ) : (
                  <div className="w-full max-w-sm mx-auto aspect-[3/4] bg-muted rounded-lg flex items-center justify-center shadow-book">
                    <BookOpen className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Basic Info */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-foreground leading-tight">
                  {book.title}
                </CardTitle>
                {bookDetail?.subtitle && (
                  <p className="text-xl text-muted-foreground mt-2">
                    {bookDetail.subtitle}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Author */}
                {(bookDetail?.author_name || book.author_name) && (
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary" />
                    <span className="text-lg font-medium">{authors}</span>
                  </div>
                )}

                {/* Publication Year */}
                {publishYear && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-lg">{publishYear}</span>
                  </div>
                )}

                {/* Publishers */}
                {(book.publisher || bookDetail?.publishers) && (
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-primary" />
                    <span className="text-lg">
                      {(book.publisher || bookDetail?.publishers || []).slice(0, 3).join(', ')}
                    </span>
                  </div>
                )}

                {/* Page Count */}
                {book.number_of_pages_median && (
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-lg">{book.number_of_pages_median} pages</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            {description && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Additional Details */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-xl">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* ISBN */}
                {allISBNs.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Hash className="w-5 h-5 text-primary" />
                      <span className="font-medium">ISBN</span>
                    </div>
                    <div className="ml-8 space-x-2">
                      {allISBNs.slice(0, 5).map((isbn) => (
                        <Badge key={isbn} variant="outline" className="font-mono">
                          {isbn}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subjects */}
                {(book.subject || bookDetail?.subjects) && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-3">Subjects</h4>
                      <div className="flex flex-wrap gap-2">
                        {(book.subject || bookDetail?.subjects || []).slice(0, 20).map((subject) => (
                          <Badge key={subject} variant="secondary" className="bg-secondary/60">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}