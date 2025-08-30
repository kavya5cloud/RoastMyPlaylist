import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-gray-900 p-12 rounded-lg">
          <div className="text-6xl mb-8">🚫</div>
          <h1 className="text-lg pixel-text text-white mb-6 uppercase leading-relaxed">404 Page Not Found</h1>
          <p className="text-green-400 pixel-text mb-8 text-sm uppercase leading-relaxed">
            This page doesn't exist
          </p>
          
          <Button 
            onClick={() => setLocation("/")}
            className="spotify-button text-primary-foreground px-8 py-3 rounded-full font-bold"
            data-testid="button-back-home"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
