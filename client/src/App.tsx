import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Home from "@/pages/home";
import Loading from "@/pages/loading";
import Results from "@/pages/results";
import NotFound from "@/pages/not-found";

function Router() {
  const { toast } = useToast();

  useEffect(() => {
    // Check for auth success/error in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const auth = urlParams.get('auth');
    const error = urlParams.get('error');

    if (auth === 'success') {
      toast({
        title: "Successfully connected to Spotify!",
        description: "Your music data is ready to be roasted.",
      });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (auth === 'error') {
      toast({
        title: "Authentication failed",
        description: "Please try connecting to Spotify again.",
        variant: "destructive",
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error === 'roast-failed') {
      toast({
        title: "Failed to generate roast",
        description: "Please try again. Make sure your Spotify account has listening history.",
        variant: "destructive",
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error === 'auth-required') {
      toast({
        title: "Authentication required",
        description: "Please log in with Spotify to continue.",
        variant: "destructive",
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/loading" component={Loading} />
      <Route path="/results" component={Results} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
