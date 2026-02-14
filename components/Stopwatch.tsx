
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, Settings2 } from 'lucide-react';

export const Stopwatch: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [presetMinutes, setPresetMinutes] = useState(10);
  
  // Custom input states
  const [inputMins, setInputMins] = useState<string>('10');
  const [inputSecs, setInputSecs] = useState<string>('0');

  // Use any or number for browser-based timer instead of NodeJS.Timeout
  const timerRef = useRef<any>(null);

  const playBell = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5); // A5

      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 2);
    } catch (e) {
      console.warn("Audio context failed", e);
    }
  };

  useEffect(() => {
    if (isActive && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      playBell();
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, secondsLeft]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (secondsLeft === 0) {
       const total = (parseInt(inputMins) || 0) * 60 + (parseInt(inputSecs) || 0);
       if (total > 0) setSecondsLeft(total);
       else setSecondsLeft(presetMinutes * 60);
    }
    setIsActive(true);
  };

  const pauseTimer = () => setIsActive(false);
  
  const resetTimer = () => {
    setIsActive(false);
    const total = (parseInt(inputMins) || 0) * 60 + (parseInt(inputSecs) || 0);
    setSecondsLeft(total > 0 ? total : presetMinutes * 60);
  };

  const handlePresetChange = (mins: number) => {
    setPresetMinutes(mins);
    setInputMins(mins.toString());
    setInputSecs('0');
    setSecondsLeft(mins * 60);
    setIsActive(false);
  };

  const handleManualApply = () => {
    const m = parseInt(inputMins) || 0;
    const s = parseInt(inputSecs) || 0;
    const total = m * 60 + s;
    if (total > 0) {
      setSecondsLeft(total);
      setIsActive(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 py-6">
      <div className="text-center">
         <h3 className="text-2xl font-bold text-slate-800 mb-2">클래스 타이머</h3>
         <p className="text-slate-500">원하는 시간을 설정하고 시작하세요!</p>
      </div>

      <div className="w-full max-w-2xl bg-white p-12 rounded-[4rem] border border-slate-200 shadow-xl flex flex-col items-center gap-12 relative overflow-hidden">
        {/* Background glow when active */}
        {isActive && (
           <div className="absolute inset-0 bg-amber-500/5 animate-pulse" />
        )}

        <div className="text-9xl md:text-[12rem] font-black text-slate-800 tabular-nums select-none relative z-10">
          {formatTime(secondsLeft)}
        </div>

        <div className="flex gap-4 relative z-10 w-full justify-center">
          {!isActive ? (
            <button
              onClick={startTimer}
              className="flex-1 max-w-[200px] h-20 bg-amber-500 hover:bg-amber-600 text-white rounded-3xl flex items-center justify-center gap-3 shadow-lg shadow-amber-200 transition-all text-2xl font-bold"
            >
              <Play fill="currentColor" size={28} /> 시작
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="flex-1 max-w-[200px] h-20 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-3xl flex items-center justify-center gap-3 transition-all text-2xl font-bold"
            >
              <Pause fill="currentColor" size={28} /> 일시정지
            </button>
          )}
          
          <button
            onClick={resetTimer}
            className="w-20 h-20 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-3xl flex items-center justify-center transition-all"
            title="초기화"
          >
            <RotateCcw size={32} />
          </button>
        </div>
      </div>

      {/* Manual Input Section */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-2 text-slate-700 font-bold">
          <Settings2 size={20} className="text-amber-500" />
          <span>직접 입력</span>
        </div>
        <div className="flex items-center gap-2 flex-grow justify-center">
          <input
            type="number"
            value={inputMins}
            onChange={(e) => setInputMins(e.target.value)}
            placeholder="분"
            className="w-24 p-3 border-2 border-slate-100 rounded-2xl text-center text-xl font-bold focus:border-amber-500 outline-none transition-all"
          />
          <span className="font-bold text-slate-400">:</span>
          <input
            type="number"
            value={inputSecs}
            onChange={(e) => setInputSecs(e.target.value)}
            placeholder="초"
            className="w-24 p-3 border-2 border-slate-100 rounded-2xl text-center text-xl font-bold focus:border-amber-500 outline-none transition-all"
          />
          <button
            onClick={handleManualApply}
            className="ml-2 px-6 py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-colors"
          >
            설정
          </button>
        </div>
      </div>

      <div className="w-full max-w-2xl">
         <div className="flex flex-wrap justify-center gap-3">
            {[1, 3, 5, 10, 15, 20, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => handlePresetChange(mins)}
                className={`px-6 py-3 rounded-2xl font-bold transition-all border-2
                  ${presetMinutes === mins && secondsLeft === mins * 60
                    ? 'bg-amber-100 border-amber-500 text-amber-700' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-amber-50'}`}
              >
                {mins}분
              </button>
            ))}
         </div>
         
         <div className="mt-8 bg-slate-50 p-6 rounded-3xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Bell className="text-amber-500" />
               <span className="text-slate-600 font-medium">시간 완료 시 알림음이 울립니다.</span>
            </div>
            <button 
              onClick={playBell}
              className="text-sm text-slate-400 hover:text-slate-600 underline"
            >
              테스트 알림음
            </button>
         </div>
      </div>
    </div>
  );
};
