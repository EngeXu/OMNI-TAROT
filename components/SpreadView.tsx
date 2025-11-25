import React from 'react';
import { SpreadDefinition, DrawnCard } from '../types';
import TarotCard from './TarotCard';

interface SpreadViewProps {
  spread: SpreadDefinition;
  drawnCards: DrawnCard[];
  onCardClick: (index: number) => void;
  revealedIndices: number[];
}

const SpreadView: React.FC<SpreadViewProps> = ({ spread, drawnCards, onCardClick, revealedIndices }) => {
  
  return (
    <div className="relative w-full max-w-3xl mx-auto h-[350px] sm:h-[450px] transition-all duration-500">
      <div className="relative w-full h-full">
         {/* Render Slots/Cards */}
         {spread.positions.map((pos, index) => {
            // Check if a card has been drawn for this position yet
            const card = drawnCards[index]; 
            const isRevealed = revealedIndices.includes(index);

            // Fixed logic for 3 card spread to be centered beautifully
            // Spread coords are x:1-12, y:1-7. 
            // For Time Flow: Past(2,4), Present(6,2), Future(10,4)
            // We can map this to percentage more directly for this specific simple view
            
            const leftPos = (pos.x / 12) * 80 + 10; // Normalize 1-12 to roughly 10%-90%
            const topPos = pos.y === 2 ? 20 : 40; // Present higher up

            return (
               <div 
                 key={`pos-${index}`}
                 className="absolute flex flex-col items-center justify-center z-10 transition-all duration-500"
                 style={{ 
                   left: `${leftPos}%`, 
                   top: `${topPos}%`,
                   transform: 'translate(-50%, 0)'
                 }}
               >
                 {card ? (
                   <div className="animate-fade-in-up">
                     <TarotCard 
                       card={card} 
                       revealed={isRevealed} 
                       onClick={() => onCardClick(index)}
                       isSmall={true}
                     />
                   </div>
                 ) : (
                   <div className="w-24 h-40 sm:w-28 sm:h-44 rounded-xl border-2 border-dashed border-slate-700/50 flex items-center justify-center bg-slate-800/20 shadow-inner">
                     <span className="text-slate-600 font-mystic text-lg opacity-50">{index + 1}</span>
                   </div>
                 )}
                 
                 <div className="mt-3 bg-black/40 px-3 py-1.5 rounded-lg text-center backdrop-blur-md min-w-[90px] border border-white/5 shadow-lg">
                   <p className="text-xs text-amber-200 font-bold tracking-wider whitespace-nowrap">{pos.name}</p>
                 </div>
               </div>
            );
         })}
      </div>
    </div>
  );
};

export default SpreadView;