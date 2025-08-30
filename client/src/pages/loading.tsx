import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

const loadingSteps = [
  "Fetching your top tracks...",
  "Analyzing music patterns...",
  "Generating roast..."
];

export default function Loading() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);

  const generateRoastMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/roast"),
    onSuccess: async (response) => {
      const data = await response.json();
      // Store roast data in sessionStorage for the results page
      sessionStorage.setItem("roastData", JSON.stringify(data));
      setLocation("/results");
    },
    onError: (error) => {
      console.error("Failed to generate roast:", error);
      setLocation("/?error=roast-failed");
    }
  });

  useEffect(() => {
    // Start the roast generation process
    generateRoastMutation.mutate();

    // Animate through steps
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= loadingSteps.length) {
          clearInterval(interval);
          return prev;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        <div className="glass-card p-8 rounded-2xl">
          <div className="text-6xl mb-6 animate-bounce">🎵</div>
          <h2 className="text-2xl font-bold mb-4">Analyzing Your Music Taste...</h2>
          <p className="text-muted-foreground mb-6">This might hurt a little 😬</p>
          
          <div className="space-y-3 text-left">
            {loadingSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-3" data-testid={`loading-step-${index}`}>
                <div 
                  className={`w-4 h-4 rounded-full transition-all duration-500 ${
                    index <= currentStep 
                      ? 'bg-primary' 
                      : 'bg-muted animate-pulse'
                  }`}
                ></div>
                <span 
                  className={`text-sm transition-all duration-500 ${
                    index <= currentStep 
                      ? 'text-foreground' 
                      : 'text-muted-foreground'
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>

          {generateRoastMutation.isError && (
            <div className="mt-6 p-4 bg-destructive/20 border border-destructive/30 rounded-lg">
              <p className="text-destructive text-sm">
                Failed to generate roast. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
