import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen, Languages, LanguageCode } from '../types';
import { Card, Button } from '../components/common';

export const SettingsScreen: React.FC = () => {
  const { language, setLanguage, t, setCurrentScreen, healthProfile, setHealthProfile } = useAppContext();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as LanguageCode;
    setLanguage(newLang);
    if (healthProfile) {
      setHealthProfile({ ...healthProfile, language: newLang });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">{t('settingsTitle')}</h1>
      <Card className="w-full max-w-sm">
        <div className="mb-6">
          <label htmlFor="language-select" className="block text-gray-600 text-sm font-semibold mb-2">
            {t('languageLabel')}
          </label>
          <div className="relative">
            <select
              id="language-select"
              value={language}
              onChange={handleLanguageChange}
              className="w-full py-3 px-4 bg-gray-100 text-black border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition appearance-none text-base"
            >
              {(Object.keys(Languages) as Array<LanguageCode>).map(code => (
                <option key={code} value={code}>
                  {Languages[code]}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
              <i className="fa-solid fa-chevron-down"></i>
            </div>
          </div>
        </div>
        <Button onClick={() => setCurrentScreen(Screen.UserProfile)} variant="secondary">
            &larr; Back to Profile
        </Button>
      </Card>
    </div>
  );
};