import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { RoastCard } from "@/components/roast-card";
import { ShareModal } from "@/components/share-modal";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Roast, MusicAnalysis, User } from "@shared/schema";

interface RoastData {
  roast: Roast;
  analysis: MusicAnalysis;
  user: Partial<User>;
}

export default function Results() {
  const [, setLocation] = useLocation();
  const [roastData, setRoastData] = useState<RoastData | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const generateNewRoastMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/roast"),
    onSuccess: async (response) => {
      const data = await response.json();
      setRoastData(data);
      sessionStorage.setItem("roastData", JSON.stringify(data));
    }
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("roastData");
    if (stored) {
      setRoastData(JSON.parse(stored));
    } else {
      setLocation("/");
    }
  }, [setLocation]);

  const handleRoastAgain = () => {
    generateNewRoastMutation.mutate();
  };

  const handleBackHome = () => {
    sessionStorage.removeItem("roastData");
    setLocation("/");
  };

  if (!roastData) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse-slow">🎵</div>
          <p className="text-muted-foreground">Loading your roast...</p>
        </div>
      </div>
    );
  }

  const { roast, analysis, user } = roastData;

  return (
    <div className="min-h-screen gradient-bg">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto">
          
          {/* User Info Header */}
          <div className="text-center mb-8">
            {user.profileImage && (
              <img 
                src={user.profileImage} 
                alt="User profile" 
                className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-primary"
                data-testid="img-profile"
              />
            )}
            <h2 className="text-2xl font-bold" data-testid="text-username">{user.displayName}</h2>
            <p className="text-muted-foreground">Spotify Music Taste Analysis</p>
          </div>

          {/* Main Roast Card */}
          <RoastCard roast={roast} analysis={analysis} />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={handleRoastAgain}
              disabled={generateNewRoastMutation.isPending}
              className="spotify-button text-primary-foreground px-8 py-3 rounded-full font-bold inline-flex items-center gap-2"
              data-testid="button-roast-again"
            >
              <i className="fas fa-refresh"></i>
              {generateNewRoastMutation.isPending ? "Generating..." : "Roast Me Again"}
            </Button>
            
            <Button 
              onClick={() => setShowShareModal(true)}
              className="share-button text-accent-foreground px-8 py-3 rounded-full font-bold inline-flex items-center gap-2"
              data-testid="button-share-roast"
            >
              <i className="fas fa-share"></i>
              Share This Roast
            </Button>
          </div>

          {/* Music Stats */}
          <div className="glass-card p-8 rounded-3xl mb-8 animate-slide-up">
            <h3 className="text-2xl md:text-3xl heading-lg mb-8 text-center text-gradient">Your Musical Breakdown</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="stat-card p-6 rounded-2xl">
                <div className="text-4xl md:text-5xl font-black text-gradient mb-2" data-testid="stat-top-artist-plays">
                  {analysis.topArtistPlays}
                </div>
                <p className="text-sm text-enhanced text-muted-foreground">{analysis.repeatArtist} plays</p>
                <div className="text-2xl mt-2">🎤</div>
              </div>
              <div className="stat-card p-6 rounded-2xl">
                <div className="text-4xl md:text-5xl font-black text-gradient mb-2" data-testid="stat-oldest-song">
                  {analysis.oldestSong}
                </div>
                <p className="text-sm text-enhanced text-muted-foreground">Oldest song year</p>
                <div className="text-2xl mt-2">⏰</div>
              </div>
              <div className="stat-card p-6 rounded-2xl">
                <div className="text-4xl md:text-5xl font-black text-gradient mb-2" data-testid="stat-avg-tempo">
                  {analysis.avgTempo}
                </div>
                <p className="text-sm text-enhanced text-muted-foreground">Avg BPM</p>
                <div className="text-2xl mt-2">⚡</div>
              </div>
              <div className="stat-card p-6 rounded-2xl">
                <div className="text-4xl md:text-5xl font-black text-gradient mb-2" data-testid="stat-unique-artists">
                  {analysis.uniqueArtists}
                </div>
                <p className="text-sm text-enhanced text-muted-foreground">Unique artists</p>
                <div className="text-2xl mt-2">👥</div>
              </div>
            </div>
          </div>

          {/* Back Home Button */}
          <div className="text-center">
            <Button 
              onClick={handleBackHome}
              variant="outline"
              className="px-6 py-2"
              data-testid="button-back-home"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        roast={roast}
        user={user}
      />
    </div>
  );
}
