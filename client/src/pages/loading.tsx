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
    // Check if we have authentication before starting roast generation
    const urlParams = new URLSearchParams(window.location.search);
    const preview = urlParams.get('preview');
    
    if (!preview) {
      // Start the roast generation process only if not in preview mode
      generateRoastMutation.mutate();
    }

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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-gray-900 p-8">
          <div className="text-6xl mb-6 animate-bounce">🎵</div>
          <h2 className="text-sm pixel-text text-white mb-4 uppercase">Analyzing Your Music Taste...</h2>
          <p className="text-green-400 pixel-text mb-6 text-xs uppercase">This might hurt a little</p>
          
          <div className="space-y-3 text-left">
            {loadingSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-3" data-testid={`loading-step-${index}`}>
                <span 
                  className={`text-xs pixel-text ${
                    index <= currentStep 
                      ? 'text-white' 
                      : 'text-gray-500'
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>

          {generateRoastMutation.isError && (
            <div className="mt-6 p-4 bg-red-900 border-2 border-red-500">
              <p className="text-red-400 text-xs pixel-text uppercase">
                Failed to generate roast. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
