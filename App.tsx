import React, { useState, useEffect } from 'react';
import StarBackground from './components/StarBackground';
import SpreadView from './components/SpreadView';
import FannedDeck from './components/FannedDeck';
import ReadingResult from './components/ReadingResult';
import { TAROT_DECK, SPREADS } from './constants';
import { DrawnCard, ReadingResponse, CardData } from './types';
import { getReadingInterpretation } from './services/geminiService';

// Simplified Phases
type AppPhase = 'intro' | 'shuffling' | 'picking' | 'revealing' | 'interpreting' | 'result';

function App() {
  const [phase, setPhase] = useState<AppPhase>('intro');
  const [userQuestion, setUserQuestion] = useState('');
  
  // Default to the only available spread
  const selectedSpread = SPREADS[0];
  
  // Deck & Draw State
  const [shuffledDeck, setShuffledDeck] = useState<CardData[]>([]);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  
  // Reading State
  const [interpretation, setInterpretation] = useState<ReadingResponse | null>(null);

  const startShuffling = () => {
    if(!userQuestion.trim()) return;
    setPhase('shuffling');
    setDrawnCards([]);
    setRevealedIndices([]);
    
    setTimeout(() => {
      // Perform Shuffle
      const deckCopy = [...TAROT_DECK];
      for (let i = deckCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deckCopy[i], deckCopy[j]] = [deckCopy[j], deckCopy[i]];
      }
      setShuffledDeck(deckCopy);
      setPhase('picking');
    }, 2000);
  };

  // User picks a card from the fanned deck
  const handleDeckPick = () => {
    const cardsNeeded = selectedSpread.positions.length;
    if (drawnCards.length >= cardsNeeded) return;

    const nextCardData = shuffledDeck[drawnCards.length];
    const nextPositionIndex = drawnCards.length;
    
    const newCard: DrawnCard = {
      ...nextCardData,
      isReversed: Math.random() > 0.3, // 30% chance of reversal
      positionName: selectedSpread.positions[nextPositionIndex].name,
      positionIndex: nextPositionIndex
    };

    const newDrawnCards = [...drawnCards, newCard];
    setDrawnCards(newDrawnCards);

    // Auto transition if spread is full
    if (newDrawnCards.length === cardsNeeded) {
      setTimeout(() => setPhase('revealing'), 500);
    }
  };

  const handleCardClick = (index: number) => {
    if (phase === 'revealing' && !revealedIndices.includes(index)) {
      setRevealedIndices(prev => [...prev, index]);
    }
  };

  const handleRevealAll = () => {
    const allIndices = Array.from({ length: selectedSpread.positions.length }, (_, i) => i);
    setRevealedIndices(allIndices);
  };

  const allRevealed = revealedIndices.length === selectedSpread.positions.length && revealedIndices.length > 0;

  const startInterpretation = async () => {
    setPhase('interpreting');
    const result = await getReadingInterpretation(userQuestion, selectedSpread, drawnCards);
    setInterpretation(result);
    setPhase('result');
  };

  const restart = () => {
    setPhase('intro');
    setUserQuestion('');
    setDrawnCards([]);
    setRevealedIndices([]);
    setInterpretation(null);
  };

  return (
    <div className="relative min-h-screen w-full text-slate-200 overflow-x-hidden flex flex-col font-sans">
      <StarBackground />
      
      {/* Nav */}
      <header className="relative z-10 p-4 sm:p-6 flex justify-between items-center backdrop-blur-sm border-b border-white/5 bg-slate-900/30">
        <div className="flex items-center gap-3 cursor-pointer" onClick={restart}>
           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
           <h1 className="text-xl sm:text-2xl font-mystic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-amber-200">
             OMNI TAROT
           </h1>
        </div>
      </header>

      <main className="relative z-10 flex-grow flex flex-col items-center justify-start p-4">
        
        {/* INTRO PHASE */}
        {phase === 'intro' && (
          <div className="max-w-lg w-full space-y-8 animate-fade-in text-center mt-[15vh]">
            <div className="space-y-3">
              <h2 className="text-4xl sm:text-5xl font-mystic text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                命运之轮
              </h2>
              <p className="text-slate-400 font-light text-lg">
                静心冥想你的困惑，开启圣三角指引
              </p>
            </div>
            <div className="relative group">
              <input
                type="text"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="请输入你的问题..."
                onKeyDown={(e) => e.key === 'Enter' && userQuestion.trim() && startShuffling()}
                className="w-full bg-slate-900/60 border border-indigo-500/30 rounded-2xl p-6 text-center text-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-400 transition-all shadow-inner backdrop-blur-sm"
              />
            </div>
            <button
              onClick={startShuffling}
              disabled={!userQuestion.trim()}
              className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-full font-mystic text-lg tracking-wider shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white"
            >
              洗牌与抽选
            </button>
          </div>
        )}

        {/* SHUFFLING PHASE */}
        {phase === 'shuffling' && (
          <div className="text-center animate-pulse flex flex-col items-center mt-[20vh]">
            <div className="relative w-32 h-48 mb-8 perspective-1000">
              <div className="absolute inset-0 border border-white/20 rounded-xl transform rotate-6 bg-indigo-900/50 animate-ping opacity-20"></div>
              <div className="absolute inset-0 border border-white/20 rounded-xl transform -rotate-6 bg-purple-900/50 animate-pulse"></div>
              <div className="absolute inset-0 border-2 border-amber-400/50 rounded-xl bg-slate-900 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.2)]">
                 <span className="text-4xl animate-spin-slow">✨</span>
              </div>
            </div>
            <h3 className="text-2xl font-mystic text-indigo-200 tracking-widest">洗牌中...</h3>
          </div>
        )}

        {/* PICKING & REVEALING PHASES */}
        {(phase === 'picking' || phase === 'revealing') && (
          <div className="w-full h-full flex flex-col items-center justify-between animate-fade-in min-h-[80vh]">
            
            <div className="w-full max-w-md text-center mb-4">
                <h3 className="text-xl text-amber-200 font-mystic border-b border-white/10 pb-2">
                    {phase === 'picking' ? '请凭借直觉抽取 3 张牌' : '点击卡牌翻开'}
                </h3>
            </div>

            {/* Spread View (Top) */}
            <div className="w-full relative flex-grow max-h-[500px]">
               <SpreadView 
                 spread={selectedSpread} 
                 drawnCards={drawnCards} 
                 onCardClick={handleCardClick}
                 revealedIndices={revealedIndices}
               />
            </div>

            {/* Controls / Fanned Deck (Bottom) */}
            <div className="w-full z-20 shrink-0 mt-auto">
              
              {phase === 'picking' && (
                 <div className="w-full overflow-hidden">
                    <FannedDeck 
                       onCardSelect={handleDeckPick} 
                       disabled={drawnCards.length >= selectedSpread.positions.length} 
                    />
                 </div>
              )}

              {phase === 'revealing' && (
                <div className="flex flex-col items-center gap-4 pb-10">
                  <div className="flex gap-4">
                      {!allRevealed && (
                         <button 
                           onClick={handleRevealAll}
                           className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-mystic rounded-full shadow-lg transition-all border border-slate-500"
                         >
                           一键揭晓
                         </button>
                      )}
                      
                      {allRevealed && (
                        <button 
                           onClick={startInterpretation}
                           className="px-10 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold font-mystic rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all scale-110 animate-pulse"
                        >
                           开始解读
                        </button>
                      )}
                  </div>
                  
                  {allRevealed && (
                      <p className="text-sm text-slate-400">
                         确认牌面无误后，点击上方按钮生成AI解析
                      </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* INTERPRETING PHASE */}
        {phase === 'interpreting' && (
          <div className="text-center animate-fade-in mt-[25vh]">
             <div className="w-24 h-24 relative mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-indigo-400 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-2xl">🔮</span>
                </div>
             </div>
             <h3 className="text-xl font-mystic text-indigo-200 mb-2">连接宇宙智慧...</h3>
             <p className="text-slate-500 text-sm">正在分析牌阵能量...</p>
          </div>
        )}

        {/* RESULT PHASE */}
        {phase === 'result' && interpretation && (
          <ReadingResult data={interpretation} onRestart={restart} />
        )}

      </main>
    </div>
  );
}

export default App;