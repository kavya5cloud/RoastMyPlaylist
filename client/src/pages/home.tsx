import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getCurrentUser, initiateSpotifyLogin } from "@/lib/spotify-auth";
import { useLocation } from "wouter";
import { TypingText, AnimatedLetters } from "@/components/typing-text";

export default function Home() {
  const [, setLocation] = useLocation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/user"],
    queryFn: getCurrentUser,
    retry: false,
  });

  const handleSpotifyLogin = async () => {
    try {
      setIsLoggingIn(true);
      const authUrl = await initiateSpotifyLogin();
      window.location.href = authUrl;
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoggingIn(false);
    }
  };

  const handleGenerateRoast = () => {
    setLocation("/loading");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse-slow">🎵</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen gradient-bg">
        <section className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <div className="mb-12">
              <div className="text-8xl md:text-9xl mb-6 animate-float">🎵</div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl heading-display text-gradient animate-glow mb-6">
                <TypingText 
                  text={`Welcome Back, ${user.displayName}!`} 
                  speed={80} 
                  className="glitch-text"
                />
              </h1>
              <div className="text-xl md:text-3xl text-enhanced text-muted-foreground mb-4 max-w-3xl mx-auto text-reveal-delay">
                <AnimatedLetters 
                  text="Ready for another brutal review of your music taste?"
                  delay={3000}
                />
              </div>
              <div className="text-lg md:text-xl text-enhanced text-muted-foreground mb-12 max-w-2xl mx-auto text-reveal-delay-2">
                <AnimatedLetters 
                  text="Let's see what questionable choices you've made recently 😈"
                  delay={4500}
                />
              </div>
            </div>

            <Button 
              onClick={handleGenerateRoast}
              className="spotify-button text-primary-foreground px-12 py-4 rounded-full text-xl font-bold"
              data-testid="button-generate-roast"
            >
              <i className="fas fa-fire text-2xl mr-3"></i>
              Roast My Playlist
            </Button>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="glass-card p-6 rounded-lg animate-slide-up">
                <div className="text-4xl mb-3">🎵</div>
                <h3 className="font-bold text-lg mb-2">Fresh Analysis</h3>
                <p className="text-muted-foreground text-sm">Updated analysis of your latest listening habits</p>
              </div>
              <div className="glass-card p-6 rounded-lg animate-slide-up" style={{animationDelay: '0.1s'}}>
                <div className="text-4xl mb-3">🤖</div>
                <h3 className="font-bold text-lg mb-2">AI-Powered Burns</h3>
                <p className="text-muted-foreground text-sm">New roasts generated just for your unique taste</p>
              </div>
              <div className="glass-card p-6 rounded-lg animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="text-4xl mb-3">📱</div>
                <h3 className="font-bold text-lg mb-2">Share the Roast</h3>
                <p className="text-muted-foreground text-sm">Generate shareable cards for social media</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <section className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
          <div className="mb-12">
            <div className="text-8xl md:text-9xl mb-6 animate-float">🔥</div>
            <h1 className="text-sm md:text-xl lg:text-2xl heading-display mb-8">
              <div className="mb-4 text-white pixel-text uppercase">
                YOUR PLAYLIST
              </div>
              <div className="text-xs md:text-lg lg:text-xl text-gradient pixel-text uppercase">
                JUST GOT ROASTED
              </div>
            </h1>
            <div className="text-xl md:text-3xl text-enhanced text-muted-foreground mb-4 max-w-3xl mx-auto">
              Connect your Spotify and let AI brutally judge your music taste
            </div>
            <div className="text-lg md:text-xl text-enhanced text-muted-foreground mb-12 max-w-2xl mx-auto">
              Prepare for some savage but hilarious feedback
            </div>
          </div>

          <Button 
            onClick={handleSpotifyLogin}
            disabled={isLoggingIn}
            className="spotify-button text-primary-foreground px-12 py-4 rounded-full text-xl font-bold inline-flex items-center gap-3 mb-8"
            data-testid="button-spotify-login"
          >
            <i className="fab fa-spotify text-2xl"></i>
            {isLoggingIn ? "Connecting..." : "Login with Spotify"}
          </Button>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="glass-card p-6 rounded-lg animate-slide-up">
              <div className="text-4xl mb-3">🎵</div>
              <h3 className="font-bold text-lg mb-2">Analyze Everything</h3>
              <p className="text-muted-foreground text-sm">Your top tracks, artists, genres, and listening patterns</p>
            </div>
            <div className="glass-card p-6 rounded-lg animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-bold text-lg mb-2">AI-Powered Roasts</h3>
              <p className="text-muted-foreground text-sm">Witty, sarcastic, and hilariously accurate burns</p>
            </div>
            <div className="glass-card p-6 rounded-lg animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-bold text-lg mb-2">Share the Pain</h3>
              <p className="text-muted-foreground text-sm">Generate shareable roast cards for social media</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center p-8 text-muted-foreground">
        <p className="text-sm">
          Made with 💜 for music lovers who can take a joke • 
          <a href="#" className="text-primary hover:underline ml-2">Privacy Policy</a> • 
          <a href="#" className="text-primary hover:underline ml-2">Terms</a>
        </p>
      </footer>
    </div>
  );
}
