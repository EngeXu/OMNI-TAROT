import React from 'react';
import { ReadingResponse } from '../types';

interface ReadingResultProps {
  data: ReadingResponse;
  onRestart: () => void;
}

const ReadingResult: React.FC<ReadingResultProps> = ({ data, onRestart }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-20 animate-fade-in">
      
      {/* Header Section */}
      <div className="text-center space-y-6 p-8 bg-gradient-to-b from-indigo-900/60 to-slate-900/0 rounded-3xl border border-indigo-500/30 shadow-2xl">
        <h2 className="text-3xl font-mystic text-amber-200">✧ 占卜结果 ✧</h2>
        <div className="bg-slate-800/40 p-6 rounded-xl border border-indigo-500/20">
           <p className="text-lg md:text-xl italic text-indigo-100 leading-relaxed font-light tracking-wide">
             "{data.overallTheme}"
           </p>
        </div>
      </div>

      {/* Detailed Card Insights */}
      <div className="space-y-6 pt-2">
        <h3 className="text-2xl font-mystic text-center text-indigo-200 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-indigo-500/50"></span>
          深度牌意解析
          <span className="h-px w-12 bg-indigo-500/50"></span>
        </h3>
        <div className="grid grid-cols-1 gap-6">
          {data.cardInsights.map((insight, idx) => (
            <div key={idx} className="bg-slate-800/30 p-6 rounded-xl border-l-4 border-indigo-500 hover:bg-slate-800/50 transition-all shadow-lg">
               <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 border-b border-white/5 pb-2">
                  <h4 className="font-bold text-xl text-amber-100">{insight.cardName}</h4>
                  <span className="text-xs uppercase text-indigo-200 tracking-widest bg-indigo-900/50 px-3 py-1 rounded border border-indigo-500/30">
                    {insight.position}
                  </span>
               </div>
               <p className="text-slate-300 text-base leading-8 text-justify tracking-wide">{insight.interpretation}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-12">
        <button 
          onClick={onRestart}
          className="px-10 py-4 bg-gradient-to-r from-slate-700 to-slate-800 border border-slate-600 text-white font-mystic rounded-full shadow-lg hover:shadow-slate-700/50 transition-all hover:scale-105 hover:text-amber-200"
        >
          开启新的占卜
        </button>
      </div>
    </div>
  );
};

export default ReadingResult;