import type { Roast, MusicAnalysis } from "@shared/schema";
import { TypingText, AnimatedLetters } from "@/components/typing-text";

interface RoastCardProps {
  roast: Roast;
  analysis: MusicAnalysis;
}

export function RoastCard({ roast, analysis }: RoastCardProps) {
  return (
    <div id="roast-card" className="roast-card p-8 md:p-12 rounded-3xl mb-8 text-center animate-fade-in">
      <div className="text-6xl md:text-7xl mb-8 animate-float">🔥</div>
      <h1 className="text-3xl md:text-5xl lg:text-6xl heading-display text-gradient animate-glow mb-8" data-testid="text-roast-headline">
        "<TypingText 
          text={roast.headline} 
          speed={60} 
          showCursor={false}
          className="glitch-text"
        />"
      </h1>
      <div className="text-xl md:text-2xl lg:text-3xl text-enhanced text-muted-foreground mb-12 leading-relaxed max-w-4xl mx-auto" data-testid="text-roast-description">
        <AnimatedLetters 
          text={roast.description}
          delay={3000}
        />
      </div>
      
      {/* Roast Categories */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="stat-card p-6 rounded-2xl animate-slide-up">
          <div className="text-3xl mb-3 animate-float">😭</div>
          <p className="text-lg heading-lg mb-2 text-gradient">Sad Songs</p>
          <p className="text-2xl font-black text-foreground" data-testid="stat-sad-songs">{analysis.sadSongsPercentage}%</p>
        </div>
        <div className="stat-card p-6 rounded-2xl animate-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="text-3xl mb-3 animate-float" style={{animationDelay: '1s'}}>📻</div>
          <p className="text-lg heading-lg mb-2 text-gradient">Mainstream</p>
          <p className="text-2xl font-black text-foreground" data-testid="stat-mainstream">{analysis.mainStreamPercentage}%</p>
        </div>
        <div className="stat-card p-6 rounded-2xl animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="text-3xl mb-3 animate-float" style={{animationDelay: '2s'}}>📅</div>
          <p className="text-lg heading-lg mb-2 text-gradient">2010s Nostalgia</p>
          <p className="text-2xl font-black text-foreground" data-testid="stat-nostalgia">{analysis.nostalgiaPercentage}%</p>
        </div>
      </div>
    </div>
  );
}
