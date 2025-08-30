import type { Roast, MusicAnalysis } from "@shared/schema";

interface RoastCardProps {
  roast: Roast;
  analysis: MusicAnalysis;
}

export function RoastCard({ roast, analysis }: RoastCardProps) {
  return (
    <div id="roast-card" className="roast-card p-8 md:p-12 rounded-3xl mb-8 text-center">
      <div className="text-6xl mb-6">🔥</div>
      <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight" data-testid="text-roast-headline">
        "{roast.headline}"
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed" data-testid="text-roast-description">
        {roast.description}
      </p>
      
      {/* Roast Categories */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-4 rounded-lg">
          <div className="text-2xl mb-2">😭</div>
          <p className="text-sm font-medium">Sad Songs</p>
          <p className="text-xs text-muted-foreground" data-testid="stat-sad-songs">{analysis.sadSongsPercentage}%</p>
        </div>
        <div className="glass-card p-4 rounded-lg">
          <div className="text-2xl mb-2">📻</div>
          <p className="text-sm font-medium">Mainstream</p>
          <p className="text-xs text-muted-foreground" data-testid="stat-mainstream">{analysis.mainStreamPercentage}%</p>
        </div>
        <div className="glass-card p-4 rounded-lg">
          <div className="text-2xl mb-2">📅</div>
          <p className="text-sm font-medium">2010s Nostalgia</p>
          <p className="text-xs text-muted-foreground" data-testid="stat-nostalgia">{analysis.nostalgiaPercentage}%</p>
        </div>
      </div>
    </div>
  );
}
