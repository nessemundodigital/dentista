
import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface TypewriterProps {
  text: string | string[];
  className?: string;
  speed?: number;
  deleteSpeed?: number;
  waitTime?: number;
  cursorChar?: string;
  infinite?: boolean;
}

export function Typewriter({
  text,
  className,
  speed = 100,
  deleteSpeed = 50,
  waitTime = 2000,
  cursorChar = "|",
  infinite = true,
}: TypewriterProps) {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "deleting" | "waiting">("typing");
  
  const sentences = Array.isArray(text) ? text : [text];
  
  const typeNextChar = useCallback(() => {
    const currentSentence = sentences[currentIndex];
    if (currentText.length < currentSentence.length) {
      setCurrentText(currentSentence.substring(0, currentText.length + 1));
    } else {
      setPhase("waiting");
      setTimeout(() => setPhase("deleting"), waitTime);
    }
  }, [currentText, currentIndex, sentences, waitTime]);
  
  const deleteChar = useCallback(() => {
    if (currentText.length > 0) {
      setCurrentText(currentText.substring(0, currentText.length - 1));
    } else {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sentences.length);
      setPhase("typing");
      if (currentIndex === sentences.length - 1 && !infinite) {
        // Stop if not infinite and we've gone through all sentences
        return;
      }
    }
  }, [currentText, currentIndex, sentences, infinite]);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (phase === "typing") {
      timeout = setTimeout(typeNextChar, speed);
    } else if (phase === "deleting") {
      timeout = setTimeout(deleteChar, deleteSpeed);
    }
    
    return () => clearTimeout(timeout);
  }, [phase, currentText, typeNextChar, deleteChar, speed, deleteSpeed]);
  
  return (
    <span className={cn("relative", className)}>
      {currentText}
      <span className="animate-pulse">{cursorChar}</span>
    </span>
  );
}
