import { useEffect, useState } from "react";
import splashLogo from "figma:asset/71015905f6d0bffa5ea8281519768e1cb47b94bb.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // Call onComplete after fade animation finishes
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-white dark:bg-black flex items-center justify-center z-50 transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center">
        {/* Logo with subtle scale animation */}
        <div className="animate-pulse-slow">
          <img 
            src={splashLogo} 
            alt="Ask My Policy" 
            className="w-48 h-48 md:w-64 md:h-64 object-contain"
          />
        </div>

        {/* Loading dots animation */}
        <div className="flex items-center gap-2 mt-8">
          <div className="size-2 rounded-full bg-primary animate-bounce-delay-0"></div>
          <div className="size-2 rounded-full bg-primary animate-bounce-delay-1"></div>
          <div className="size-2 rounded-full bg-primary animate-bounce-delay-2"></div>
        </div>
      </div>
    </div>
  );
}
