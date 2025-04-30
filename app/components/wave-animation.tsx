'use client'

import React from 'react';

export const WaveAnimation = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* First wave */}
      <div className="absolute w-full h-[50px] min-w-[1000px] -bottom-5 left-0 right-0">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 1000 50" 
          preserveAspectRatio="none"
          style={{
            animation: 'wave 15s linear infinite',
          }}
        >
          <path 
            d="M0,0 C175,40 275,20 500,30 C700,40 800,10 1000,30 L1000,50 L0,50 Z" 
            className="fill-[#3fdaa4]/10"
          ></path>
        </svg>
      </div>
      
      {/* Second wave */}
      <div className="absolute w-full h-[70px] min-w-[1200px] -bottom-5 left-0 right-0">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 1200 70" 
          preserveAspectRatio="none"
          style={{
            animation: 'wave 18s linear reverse infinite',
          }}
        >
          <path 
            d="M0,20 C100,50 300,0 500,20 C700,40 900,10 1200,30 L1200,70 L0,70 Z" 
            className="fill-[#6be5fd]/8"
          ></path>
        </svg>
      </div>
      
      {/* Third wave */}
      <div className="absolute w-full h-[90px] min-w-[1500px] -bottom-5 left-0 right-0">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 1500 90" 
          preserveAspectRatio="none"
          style={{
            animation: 'wave 20s linear infinite',
          }}
        >
          <path 
            d="M0,40 C200,10 400,60 700,30 C1000,0 1300,50 1500,20 L1500,90 L0,90 Z" 
            className="fill-[#3fdaa4]/5"
          ></path>
        </svg>
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-5%);
          }
          100% {
            transform: translateX(-10%);
          }
        }
      `}</style>
    </div>
  );
}; 