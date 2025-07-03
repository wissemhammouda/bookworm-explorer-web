import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center animate-fade-in">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <BookOpen className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! This page seems to be missing from our library</p>
        <Button asChild variant="default" size="lg" className="gap-2">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Return to Library
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
