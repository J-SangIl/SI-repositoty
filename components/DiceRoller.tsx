
import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export const DiceRoller: React.FC = () => {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<number[]>([]);

  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    let rolls = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls > 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setHistory(prev => [finalValue, ...prev].slice(0, 10));
        setIsRolling(false);
      }
    }, 100);
  };

  const renderDiceFace = (val: number) => {
    const dotsMap: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8]
    };

    return (
      <div className="grid grid-cols-3 gap-2 w-32 h-32 md:w-48 md:h-48 p-4 md:p-6 bg-white rounded-[2rem] shadow-inner border-2 border-slate-100">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            {dotsMap[val].includes(i) && (
              <div className="w-4 h-4 md:w-6 md:h-6 bg-rose-600 rounded-full shadow-sm" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-10 py-6">
      <div className="text-center">
         <h3 className="text-2xl font-bold text-slate-800 mb-2">주사위 굴리기</h3>
         <p className="text-slate-500">주사위를 눌러서 숫자를 뽑으세요.</p>
      </div>

      <div className="flex flex-col items-center gap-10">
        <button
          onClick={rollDice}
          disabled={isRolling}
          className={`relative group p-10 bg-slate-100 rounded-[4rem] transition-all
            ${isRolling ? 'animate-bounce' : 'hover:scale-105 active:scale-95 shadow-xl hover:shadow-rose-100'}`}
        >
          <div className="bg-white p-4 rounded-[3rem] border-4 border-rose-500 shadow-lg">
            {renderDiceFace(diceValue)}
          </div>
          {!isRolling && (
             <div className="absolute -bottom-4 bg-rose-600 text-white px-6 py-2 rounded-full font-black text-lg shadow-lg group-hover:scale-110 transition-transform">
               CLICK TO ROLL!
             </div>
          )}
        </button>

        <div className="w-full max-w-md bg-white p-6 rounded-3xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
             <h4 className="font-bold text-slate-700">최근 기록 (최대 10개)</h4>
             <button 
               onClick={() => setHistory([])}
               className="text-slate-400 hover:text-rose-500 transition-colors"
             >
               <RotateCcw size={18} />
             </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {history.map((val, idx) => (
              <div 
                key={idx} 
                className="w-10 h-10 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl flex items-center justify-center font-bold text-lg animate-in fade-in slide-in-from-top-2"
              >
                {val}
              </div>
            ))}
            {history.length === 0 && (
              <p className="text-slate-400 text-sm italic">주사위를 굴려보세요.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
