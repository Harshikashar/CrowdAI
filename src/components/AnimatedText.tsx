
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  texts: { text: React.ReactNode; className?: string }[];
  interval?: number;
  fadeTime?: number;
}

const AnimatedText = ({
  texts,
  interval = 5000,
  fadeTime = 500,
}: AnimatedTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (texts.length <= 1) return;

    // Function to toggle visibility and change text
    const toggleText = () => {
      setIsVisible(false);
      
      // After fade out, change the text
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsVisible(true);
      }, fadeTime);
    };
    
    // Set interval to change text
    const intervalId = setInterval(toggleText, interval);
    
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [texts, interval, fadeTime]);

  if (texts.length === 0) {
    return null;
  }

  const { text, className } = texts[currentIndex];

  return (
    <div
      className={cn(
        "transition-opacity duration-500",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {text}
    </div>
  );
};

export default AnimatedText;
