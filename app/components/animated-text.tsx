'use client'

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = '' }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (elementRef.current) {
              setTimeout(() => {
                elementRef.current?.classList.add('animate');
              }, 100);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  // Split text into array of words
  const words = text.split(' ');

  // If not mounted yet, show regular text
  if (!mounted) {
    return (
      <div className={className}>
        {text}
      </div>
    );
  }

  return (
    <div ref={elementRef} className={`animated-text ${className}`}>
      {words.map((word, wordIndex) => (
        <div key={`word-${wordIndex}`} className="word inline-block mr-3 overflow-hidden">
          <span className="inline-block word-inner">
            {word}
          </span>
        </div>
      ))}
      
      <style jsx>{`
        .animated-text .word-inner {
          transform: translateY(0);
          opacity: 1;
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                      opacity 0.5s ease;
        }
        
        .animated-text:not(.animate) .word-inner {
          transform: translateY(100%);
          opacity: 0;
        }
        
        .animated-text.animate .word-inner {
          transform: translateY(0);
          opacity: 1;
        }
        
        .animated-text .word:nth-child(1) .word-inner {
          transition-delay: 0.1s;
        }
        
        .animated-text .word:nth-child(2) .word-inner {
          transition-delay: 0.15s;
        }
        
        .animated-text .word:nth-child(3) .word-inner {
          transition-delay: 0.2s;
        }
        
        .animated-text .word:nth-child(4) .word-inner {
          transition-delay: 0.25s;
        }
        
        .animated-text .word:nth-child(5) .word-inner {
          transition-delay: 0.3s;
        }
        
        .animated-text .word:nth-child(6) .word-inner {
          transition-delay: 0.35s;
        }
        
        .animated-text .word:nth-child(7) .word-inner {
          transition-delay: 0.4s;
        }
        
        .animated-text .word:nth-child(8) .word-inner {
          transition-delay: 0.45s;
        }
        
        .animated-text .word:nth-child(9) .word-inner {
          transition-delay: 0.5s;
        }
        
        .animated-text .word:nth-child(10) .word-inner {
          transition-delay: 0.55s;
        }
      `}</style>
    </div>
  );
}; 