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
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Reset when text changes
  useEffect(() => {
    setDisplayText("");
    setCurrentIndex(-1);
    setIsStarted(false);
    setIsComplete(false);
  }, [text]);

  // Start typing after delay
  useEffect(() => {
    if (currentIndex === -1 && !isStarted) {
      const timer = setTimeout(() => {
        setIsStarted(true);
        setCurrentIndex(0);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isStarted, delay]);

  // Type each character
  useEffect(() => {
    if (isStarted && currentIndex >= 0 && currentIndex <= text.length) {
      const timer = setTimeout(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.substring(0, currentIndex + 1));
          setCurrentIndex(prev => prev + 1);
        } else if (!isComplete) {
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isStarted, text, speed, isComplete, onComplete]);

  return (
    <span className={`pixel-text ${className}`}>
      {displayText}
      {showCursor && !isComplete && isStarted && (
        <span className="pixel-cursor">█</span>
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