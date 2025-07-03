import { BookOpen } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "Searching books..." }: LoadingSpinnerProps) {
  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse-glow">
        <BookOpen className="w-8 h-8 text-primary animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="w-4 h-4 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}