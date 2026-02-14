
import React from 'react';
import { QrCode, Users, Timer, Dices } from 'lucide-react';
import { AppState } from '../types';

interface DashboardProps {
  onSelectApp: (app: AppState) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectApp }) => {
  const tools = [
    {
      id: 'qr',
      title: 'QR 생성기',
      description: 'URL을 넣으면 즉석에서 QR 코드를 생성합니다.',
      icon: <QrCode size={48} />,
      color: 'bg-blue-500'
    },
    {
      id: 'picker',
      title: '랜덤 뽑기',
      description: '명단을 붙여넣고 랜덤하게 한 명씩 뽑습니다.',
      icon: <Users size={48} />,
      color: 'bg-emerald-500'
    },
    {
      id: 'timer',
      title: '타이머',
      description: '1분~60분까지 설정 가능한 클래스용 타이머입니다.',
      icon: <Timer size={48} />,
      color: 'bg-amber-500'
    },
    {
      id: 'dice',
      title: '주사위 뽑기',
      description: '랜덤 주사위를 굴려 숫자를 확인합니다.',
      icon: <Dices size={48} />,
      color: 'bg-rose-500'
    }
  ];

  return (
    <div className="py-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-slate-800 mb-4">교실 도구함</h2>
        <p className="text-slate-500 text-lg">원하는 도구를 선택하여 수업을 더 재미있게 만들어보세요!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelectApp(tool.id as AppState)}
            className="group p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left flex items-start gap-6"
          >
            <div className={`${tool.color} text-white p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
              {tool.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{tool.title}</h3>
              <p className="text-slate-500 leading-relaxed">{tool.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
