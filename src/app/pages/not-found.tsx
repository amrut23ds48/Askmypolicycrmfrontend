import { Link } from "react-router";
import { Home, ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Home className="size-4" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
