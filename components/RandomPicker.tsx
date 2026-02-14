
import React, { useState, useMemo } from 'react';
import { Plus, RotateCcw, Play, UserCheck, Trash2 } from 'lucide-react';
import { PickerItem } from '../types';

export const RandomPicker: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [items, setItems] = useState<PickerItem[]>([]);
  const [lastPicked, setLastPicked] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);

  const remainingItems = useMemo(() => items.filter(i => !i.isPicked), [items]);
  const pickedItems = useMemo(() => items.filter(i => i.isPicked), [items]);

  const loadList = () => {
    if (!inputText.trim()) return;
    const names = inputText
      .split(/[\n,]/)
      .map(n => n.trim())
      .filter(n => n !== '');
    
    const newItems = names.map((name, index) => ({
      id: `${name}-${index}-${Date.now()}`,
      name,
      isPicked: false
    }));
    
    setItems(newItems);
    setLastPicked(null);
  };

  const pickRandom = () => {
    if (remainingItems.length === 0) return;
    
    setIsPicking(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * remainingItems.length);
      setLastPicked(remainingItems[randomIndex].name);
      counter++;
      
      if (counter > 15) {
        clearInterval(interval);
        const finalRandomIndex = Math.floor(Math.random() * remainingItems.length);
        const selected = remainingItems[finalRandomIndex];
        
        setItems(prev => prev.map(item => 
          item.id === selected.id ? { ...item, isPicked: true } : item
        ));
        setLastPicked(selected.name);
        setIsPicking(false);
      }
    }, 100);
  };

  const resetPicking = () => {
    setItems(prev => prev.map(item => ({ ...item, isPicked: false })));
    setLastPicked(null);
  };

  const clearAll = () => {
    setItems([]);
    setLastPicked(null);
    setInputText('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-6">
      {/* Input Section */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <h3 className="text-xl font-bold text-slate-800">명단 입력</h3>
          <p className="text-sm text-slate-500">엑셀 명단을 복사해 붙여넣거나 콤마(,) 또는 줄바꿈으로 입력하세요.</p>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-64 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none font-mono text-sm"
            placeholder="홍길동&#10;김철수&#10;이영희..."
          />
          <button
            onClick={loadList}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={20} /> 명단 불러오기
          </button>
        </div>
      </div>

      {/* Picking Area */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center min-h-[300px] text-center relative overflow-hidden">
          <div className="absolute top-4 right-4 flex gap-2">
             <button onClick={resetPicking} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors" title="뽑기 기록 초기화">
               <RotateCcw size={20} />
             </button>
             <button onClick={clearAll} className="p-2 text-slate-400 hover:text-rose-600 transition-colors" title="전체 삭제">
               <Trash2 size={20} />
             </button>
          </div>

          {lastPicked ? (
            <div className="animate-in zoom-in duration-300">
               <p className="text-emerald-600 font-bold mb-2">오늘의 당첨자!</p>
               <h2 className="text-7xl font-black text-slate-800 break-all px-4">{lastPicked}</h2>
            </div>
          ) : (
            <div className="text-slate-300">
               <UserCheck size={80} className="mx-auto mb-4" />
               <p className="text-xl font-medium">명단을 불러온 후 버튼을 눌러주세요</p>
            </div>
          )}

          <div className="mt-12 w-full max-w-xs">
            <button
              disabled={isPicking || remainingItems.length === 0}
              onClick={pickRandom}
              className={`w-full py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-lg transition-all
                ${remainingItems.length > 0 && !isPicking 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white scale-100 hover:scale-105 active:scale-95' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
            >
              <Play fill="currentColor" size={24} />
              {remainingItems.length === 0 ? '남은 명단 없음' : '랜덤 뽑기 시작!'}
            </button>
            {items.length > 0 && (
              <p className="mt-4 text-slate-500 font-medium">
                남은 인원: <span className="text-emerald-600">{remainingItems.length}</span> / {items.length}
              </p>
            )}
          </div>
        </div>

        {/* History List */}
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
          <h4 className="font-bold text-slate-700 mb-4">현재 명단 현황</h4>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <span
                key={item.id}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors
                  ${item.isPicked 
                    ? 'bg-slate-200 text-slate-400 border-slate-200 line-through' 
                    : 'bg-white text-emerald-700 border-emerald-200 shadow-sm'}`}
              >
                {item.name}
              </span>
            ))}
            {items.length === 0 && (
              <p className="text-slate-400 text-sm italic">명단이 비어있습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
