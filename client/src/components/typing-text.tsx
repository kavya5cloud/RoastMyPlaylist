import { useEffect, useState } from 'react';

interface TypingTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  showCursor?: boolean;
  onComplete?: () => void;
}

export function TypingText({ 
  text, 
  speed = 100, 
  delay = 0, 
  className = "", 
  showCursor = true,
  onComplete 
}: TypingTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset state when text changes
    setDisplayText("");
    setCurrentIndex(0);
    setIsComplete(false);
    
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        setCurrentIndex(0);
      }, delay);
      return () => clearTimeout(delayTimer);
    }
  }, [text, delay]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentIndex === text.length && !isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  return (
    <span className="block text-gradient font-light">
      {displayText}
      {showCursor && !isComplete && (
        <span className="animate-pulse text-cyan-400">|</span>
      )}
    </span>
  );
}

interface AnimatedLettersProps {
  text: string;
  className?: string;
  delay?: number;
}

export function AnimatedLetters({ text, className = "", delay = 0 }: AnimatedLettersProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!isVisible) return null;

  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="letter-animation"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}