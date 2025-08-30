import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
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

  // Check authentication first
  const { data: user, isLoading: isCheckingAuth, isError: authError } = useQuery({
    queryKey: ["/api/user"],
    retry: false,
  });

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
      setLocation("/");
    }
  });

  useEffect(() => {
    // Redirect to home if not authenticated
    if (authError || (!isCheckingAuth && !user)) {
      setLocation("/");
      return;
    }

    // Check if we have authentication before starting roast generation
    const urlParams = new URLSearchParams(window.location.search);
    const preview = urlParams.get('preview');
    
    if (!preview && user && !generateRoastMutation.isSuccess && !generateRoastMutation.isPending) {
      // Start the roast generation process only if authenticated and not already started
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
  }, [user, isCheckingAuth, authError, generateRoastMutation.isSuccess, generateRoastMutation.isPending]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="bg-gray-900 p-12 rounded-lg">
          <div className="text-6xl mb-8">🎵</div>
          <h2 className="text-lg pixel-text text-white mb-6 uppercase leading-relaxed">Analyzing Your Music Taste...</h2>
          <p className="text-green-400 pixel-text mb-8 text-sm uppercase leading-relaxed">This might hurt a little</p>
          
          <div className="space-y-4 text-left max-w-sm mx-auto">
            {loadingSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-3" data-testid={`loading-step-${index}`}>
                <div className={`w-4 h-4 border-2 flex-shrink-0 ${
                  index <= currentStep 
                    ? 'border-green-400 bg-green-400' 
                    : 'border-gray-500'
                }`}>
                  {index <= currentStep && (
                    <div className="text-black text-xs leading-none">✓</div>
                  )}
                </div>
                <span 
                  className={`text-xs pixel-text leading-relaxed break-words ${
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
