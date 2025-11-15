import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';

interface ProgressRingProps {
  progress: number;
  color: string;
  label: string;
  value: string;
  goal: string;
  icon: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ progress, color, label, value, goal, icon }) => {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-32 h-32">
        <svg
          height="100%"
          width="100%"
          viewBox="0 0 120 120"
          className="-rotate-90"
        >
          <circle
            className="text-gray-200/50"
            strokeWidth={stroke}
            stroke="currentColor"
            fill="transparent"
            r={normalizedRadius}
            cx={radius + stroke}
            cy={radius + stroke}
          />
          <circle
            className={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
            stroke="currentColor"
            fill="transparent"
            r={normalizedRadius}
            cx={radius + stroke}
            cy={radius + stroke}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className={`${icon} text-2xl ${color}`}></i>
        </div>
      </div>
      <p className="font-bold mt-2 text-gray-700">{label}</p>
      <p className="text-sm text-gray-500">{value} / {goal}</p>
    </div>
  );
};

export const UserProfileScreen: React.FC = () => {
  const { setCurrentScreen, dailyProgress, healthProfile, t } = useAppContext();

  // Data derived from context, ensuring goals are not zero to prevent division errors
  const progressData = [
    { 
      label: t('calories'), 
      value: `${Math.round(dailyProgress.consumed.calories)}`, 
      goal: `${dailyProgress.goals.calories} kcal`, 
      progress: dailyProgress.goals.calories > 0 ? (dailyProgress.consumed.calories / dailyProgress.goals.calories) * 100 : 0, 
      color: 'text-orange-500', 
      icon: 'fa-solid fa-fire' 
    },
    { 
      label: t('carbs'), 
      value: `${Math.round(dailyProgress.consumed.carbs)}g`, 
      goal: `${dailyProgress.goals.carbs}g`, 
      progress: dailyProgress.goals.carbs > 0 ? (dailyProgress.consumed.carbs / dailyProgress.goals.carbs) * 100 : 0, 
      color: 'text-blue-500', 
      icon: 'fa-solid fa-bread-slice' 
    },
    { 
      label: t('protein'), 
      value: `${Math.round(dailyProgress.consumed.protein)}g`, 
      goal: `${dailyProgress.goals.protein}g`, 
      progress: dailyProgress.goals.protein > 0 ? (dailyProgress.consumed.protein / dailyProgress.goals.protein) * 100 : 0,
      color: 'text-red-500', 
      icon: 'fa-solid fa-drumstick-bite' 
    },
    { 
      label: t('fat'), 
      value: `${Math.round(dailyProgress.consumed.fat)}g`, 
      goal: `${dailyProgress.goals.fat}g`, 
      progress: dailyProgress.goals.fat > 0 ? (dailyProgress.consumed.fat / dailyProgress.goals.fat) * 100 : 0,
      color: 'text-purple-500', 
      icon: 'fa-solid fa-oil-can' 
    },
  ];

  // Motivational quote logic
  const allGoalsMet = progressData.every(item => item.progress >= 100);
  const motivationalQuote = allGoalsMet 
    ? t('motivationalQuote_good')
    : t('motivationalQuote_keepGoing');

  return (
    <div 
      className="relative min-h-screen bg-cover bg-center pb-28"
      style={{ backgroundImage: "url('https://i.postimg.cc/bNQSg6h2/fundo-neutro-com-leve-desfoque-elementos-sutis.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">{t('userProfileTitle')}</h1>
            <p className="text-gray-200">{t('userProfileSubtitle')}</p>
          </div>
          <div
            className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm overflow-hidden"
          >
            {healthProfile?.avatar ? (
              <img src={healthProfile.avatar} alt="User Avatar" className="w-full h-full object-cover" />
            ) : (
              <i className="fa-solid fa-user text-purple-600 text-2xl"></i>
            )}
          </div>
        </header>

        {/* Daily Progress */}
        <section className="px-4">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-3xl shadow-lg">
            <h2 className="font-bold text-lg text-gray-800 mb-4 px-2">{t('dailyProgressTitle')}</h2>
            <div className="grid grid-cols-2 gap-y-4">
              {progressData.map(item => (
                <ProgressRing key={item.label} {...item} />
              ))}
            </div>
          </div>
        </section>

        {/* Motivational Quote Section */}
        <section className="px-4 mt-6">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg text-center">
              <p className="text-gray-600 italic">"{motivationalQuote}"</p>
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button 
          onClick={() => setCurrentScreen(Screen.Camera)}
          className="w-16 h-16 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center text-3xl transform hover:scale-110 active:scale-95 transition-transform"
          aria-label="Adicionar Alimento"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>
    </div>
  );
};
