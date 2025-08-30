import { useEffect, useState, useRef } from 'react';

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
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const indexRef = useRef(0);

  // Reset when text changes
  useEffect(() => {
    setDisplayText("");
    setIsTyping(false);
    setIsComplete(false);
    indexRef.current = 0;
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [text]);

  // Start typing after delay
  useEffect(() => {
    if (!isTyping && !isComplete && text.length > 0) {
      const startTimer = setTimeout(() => {
        setIsTyping(true);
        
        intervalRef.current = setInterval(() => {
          if (indexRef.current < text.length) {
            setDisplayText(text.substring(0, indexRef.current + 1));
            indexRef.current++;
          } else {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setIsTyping(false);
            setIsComplete(true);
            onComplete?.();
          }
        }, speed);
      }, delay);

      return () => {
        clearTimeout(startTimer);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [text, speed, delay, isTyping, isComplete, onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <span className={`pixel-text typewriter-container ${className}`}>
      {displayText}
      {showCursor && (
        <span className={`pixel-cursor ${isComplete ? 'cursor-complete' : ''}`}>█</span>
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