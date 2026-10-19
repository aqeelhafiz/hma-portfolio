'use client'

import React from 'react'

export default function SnakeMarquee({ tools }: { tools: { name: string, imgSrc: string }[] }) {
  const ITEM_WIDTH = 240; 
  const TRACK_WIDTH = tools.length * ITEM_WIDTH;
  
  // Horizontal movement speed (target ~40px/s)
  const SPEED_PX_PER_SEC = 40;
  const horizontalDuration = TRACK_WIDTH / SPEED_PX_PER_SEC; 

  // We want the wave to have a specific wavelength (4 items long)
  const ITEMS_PER_WAVELENGTH = 4;
  const WAVELENGTH_PX = ITEMS_PER_WAVELENGTH * ITEM_WIDTH;
  
  // Time it takes for the track to move one full wavelength horizontally
  const waveCycleDuration = WAVELENGTH_PX / SPEED_PX_PER_SEC;
  // Since CSS alternate animation means 1 iteration = half cycle
  const bobDuration = waveCycleDuration / 2;

  // The delay offset per item to lock it to the static physical wave path
  const delayPerItem = waveCycleDuration / ITEMS_PER_WAVELENGTH;

  return (
    <div className="relative w-full max-w-full overflow-hidden mask-edges py-10 sm:py-12">
      <style>{`
        .mask-edges {
          mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
        }
        .snake-track {
          display: flex;
          width: max-content;
          animation: snake-lr ${horizontalDuration * 2}s linear infinite;
          will-change: transform;
        }
        @keyframes snake-lr {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0%, 0, 0); }
        }
        .snake-item {
          width: ${ITEM_WIDTH}px;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: snake-bob ${bobDuration}s ease-in-out infinite alternate;
          will-change: transform;
        }
        @keyframes snake-bob {
          0% { transform: translate3d(0, -12px, 0); }
          100% { transform: translate3d(0, 12px, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .snake-track, .snake-item {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="snake-track">
        {/* Render 2 identical tracks for the seamless infinite loop */}
        {[...Array(2)].map((_, trackIndex) => (
          <div key={trackIndex} className="flex">
            {tools.map((tool, j) => {
              // Global index keeps the wave continuous across the track seam
              const globalIndex = trackIndex * tools.length + j;
              // Delay calculation locks the vertical position to the horizontal coordinate
              const delay = -(globalIndex * delayPerItem);
              
              return (
                <div 
                  key={j} 
                  className="snake-item"
                  style={{ animationDelay: `${delay}s` }}
                >
                  <div className="flex items-center gap-3 sm:gap-4 group cursor-default opacity-95 hover:opacity-100 transition-opacity duration-300">
                    <img 
                      src={tool.imgSrc} 
                      alt={tool.name} 
                      className="h-8 sm:h-9 w-auto max-w-[120px] object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105" 
                      loading="lazy"
                    />
                    <span className="text-[15px] sm:text-[16px] font-semibold text-[#0F172A] tracking-normal whitespace-nowrap group-hover:text-[#000000] transition-colors">
                      {tool.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
