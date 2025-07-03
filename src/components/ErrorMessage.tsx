import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="max-w-md mx-auto py-8 animate-fade-in">
      <Alert className="border-destructive/20 bg-destructive/5">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-destructive font-medium">
          {message}
        </AlertDescription>
      </Alert>
      
      {onRetry && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={onRetry}
            variant="outline"
            className="gap-2 border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}