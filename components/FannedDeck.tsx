import React, { useState, useEffect } from 'react';

interface FannedDeckProps {
  onCardSelect: () => void;
  disabled: boolean;
  totalCards?: number;
}

const FannedDeck: React.FC<FannedDeckProps> = ({ onCardSelect, disabled, totalCards = 40 }) => {
  // We simulate a deck with `totalCards` elements for visual density
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    // Initialize visible cards
    setVisibleCards(Array.from({ length: totalCards }, (_, i) => i));
  }, [totalCards]);

  const handleCardClick = (index: number) => {
    if (disabled) return;
    
    // Remove the card visually to show it was picked
    setVisibleCards(prev => prev.filter(i => i !== index));
    onCardSelect();
  };

  return (
    <div className="relative w-full h-64 sm:h-80 flex justify-center items-end overflow-hidden pointer-events-auto">
      <div className="relative w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] top-[40%]">
        {Array.from({ length: totalCards }).map((_, i) => {
          if (!visibleCards.includes(i)) return null;

          const isHovered = hoveredIndex === i;
          
          // Calculate rotation
          // Spread cards across -60deg to 60deg
          const angleStep = 100 / totalCards;
          const angle = -50 + (i * angleStep);
          
          // Calculate translation for the arc effect
          const radian = (angle * Math.PI) / 180;
          const radius = 350; // Approximate radius
          
          // We use simple rotation origin at bottom center
          return (
            <div
              key={i}
              onClick={() => handleCardClick(i)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`absolute bottom-0 left-1/2 w-16 h-28 sm:w-24 sm:h-40 bg-slate-800 border border-amber-900/40 rounded-lg shadow-[-2px_2px_5px_rgba(0,0,0,0.5)] cursor-pointer transition-all duration-200 origin-bottom-left`}
              style={{
                transform: `
                  translateX(-50%) 
                  rotate(${angle}deg) 
                  translateY(${isHovered ? '-40px' : '0px'})
                  translateY(-${radius}px)
                `,
                zIndex: isHovered ? 100 : i,
                backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')",
              }}
            >
              {/* Card Back Design Detail */}
              <div className="absolute inset-1 border border-amber-700/20 rounded opacity-50"></div>
              <div className="absolute inset-0 bg-indigo-900/20"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FannedDeck;