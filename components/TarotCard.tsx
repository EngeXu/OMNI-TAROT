import React from 'react';
import { DrawnCard, Suit } from '../types';

interface TarotCardProps {
  card: DrawnCard;
  revealed: boolean;
  onClick?: () => void;
  isSmall?: boolean;
}

const TarotCard: React.FC<TarotCardProps> = ({ card, revealed, onClick, isSmall = false }) => {
  
  const getSuitColor = (suit: Suit) => {
    switch (suit) {
      case Suit.WANDS: return "text-red-400";
      case Suit.CUPS: return "text-cyan-400";
      case Suit.SWORDS: return "text-slate-300";
      case Suit.PENTACLES: return "text-amber-400";
      case Suit.MAJOR: return "text-purple-400";
      default: return "text-white";
    }
  };

  const baseClasses = isSmall 
    ? "w-24 h-40 sm:w-28 sm:h-44 text-xs" 
    : "w-40 h-64 sm:w-48 sm:h-80 text-sm";

  return (
    <div 
      onClick={onClick}
      className={`relative ${baseClasses} cursor-pointer group perspective-1000 transition-transform duration-300 hover:scale-105`}
    >
      <div className={`relative w-full h-full transition-all duration-1000 transform-style-3d ${revealed ? 'rotate-y-180' : ''}`}>
        
        {/* Card Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl shadow-2xl border-2 border-indigo-900/50 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
          <div className="absolute inset-2 border border-indigo-500/30 rounded-lg flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-indigo-400/50 flex items-center justify-center">
              <div className="w-8 h-8 rotate-45 border border-indigo-300/50"></div>
            </div>
          </div>
        </div>

        {/* Card Front */}
        <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl shadow-2xl border border-slate-600 bg-slate-800 overflow-hidden flex flex-col ${card.isReversed ? 'rotate-180' : ''}`}>
          {/* Image Placeholder */}
          <div className="h-2/3 w-full bg-slate-900 relative overflow-hidden">
             {/* Using Picsum with seed based on card ID for consistency */}
             <img 
               src={`https://picsum.photos/seed/${card.id}/300/500`} 
               alt={card.name}
               className="w-full h-full object-cover opacity-80 mix-blend-overlay"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-800 to-transparent"></div>
          </div>
          
          <div className="h-1/3 p-2 flex flex-col items-center justify-center text-center border-t border-slate-600/50 bg-slate-800">
             <span className={`font-mystic font-bold uppercase tracking-widest ${getSuitColor(card.suit)}`}>
               {card.name}
             </span>
             {card.isReversed && <span className="text-[10px] text-red-400 mt-1 uppercase tracking-wider">(Reversed)</span>}
             <span className="text-[10px] text-slate-400 mt-2 line-clamp-2">{card.keywords.join(" • ")}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TarotCard;