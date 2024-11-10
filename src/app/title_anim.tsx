// Title.tsx
"use client";
import React, { useEffect, useState } from "react";

interface TitleProps {
  text: string;
  className?: string; // Allows additional styling if needed
}

const Title: React.FC<TitleProps> = ({ text, className }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true); // Start animation on mount
  }, []);

  return (
    <>
      <h1
        className={`text-5xl font-bold text-white text-center ${
          animate ? "subtle-animation" : ""
        } ${className}`}
      >
        {text}
      </h1>
      <style jsx>{`
        .subtle-animation {
          opacity: 1;
          animation: subtleJumpAndLand 1.2s ease-out forwards;
        }

        @keyframes subtleJumpAndLand {
          0% {
            opacity: 0; /* Start invisible */
            transform: translateY(20px); /* Start slightly below */
          }
          60% {
            opacity: 1; /* Fade in and move up */
            transform: translateY(-5px); /* Move up a bit */
          }
          80% {
            transform: translateY(3px); /* Slight bounce down */
          }
          100% {
            transform: translateY(0); /* Settle at final position */
          }
        }
      `}</style>
    </>
  );
};

export default Title;
