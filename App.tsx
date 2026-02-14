
import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { QRGenerator } from './components/QRGenerator';
import { RandomPicker } from './components/RandomPicker';
import { Stopwatch } from './components/Stopwatch';
import { DiceRoller } from './components/DiceRoller';
import { Home } from 'lucide-react';
import { AppState } from './types';

const App: React.FC = () => {
  const [currentApp, setCurrentApp] = useState<AppState>('dashboard');

  const renderApp = () => {
    switch (currentApp) {
      case 'qr':
        return <QRGenerator />;
      case 'picker':
        return <RandomPicker />;
      case 'timer':
        return <Stopwatch />;
      case 'dice':
        return <DiceRoller />;
      default:
        return <Dashboard onSelectApp={setCurrentApp} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {currentApp !== 'dashboard' && (
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-1 rounded-lg">
              {currentApp === 'qr' && 'QR'}
              {currentApp === 'picker' && '🎲'}
              {currentApp === 'timer' && '⏰'}
              {currentApp === 'dice' && '🔢'}
            </span>
            {currentApp === 'qr' && 'QR 생성기'}
            {currentApp === 'picker' && '랜덤 명단 뽑기'}
            {currentApp === 'timer' && '클래스 타이머'}
            {currentApp === 'dice' && '주사위 굴리기'}
          </h1>
          <button
            onClick={() => setCurrentApp('dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors font-medium text-sm"
          >
            <Home size={18} />
            홈으로 돌아가기
          </button>
        </header>
      )}
      
      <main className="flex-grow p-4 md:p-8 max-w-5xl mx-auto w-full">
        {renderApp()}
      </main>

      <footer className="py-6 text-center text-slate-400 text-sm">
        © 2024 교실 복합 도구함 | Classroom Toolkit
      </footer>
    </div>
  );
};

export default App;
