import React, { createContext, useState, useContext, ReactNode, FC, useEffect } from 'react';
import { Screen, HealthProfile, AnalysisResult, LanguageCode, DailyProgress } from '../types';
import * as translations from '../localization';

interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  healthProfile: HealthProfile | null;
  setHealthProfile: (profile: HealthProfile) => void;
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  capturedImage: string | null;
  setCapturedImage: (image: string | null) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  dailyProgress: DailyProgress;
  addFoodToProgress: (nutrition: { calories: number; carbs: number; protein: number; fat: number; }) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock profile for demo purposes
const mockProfile: HealthProfile = {
  age: 30,
  weight: 70,
  height: 175,
  gender: 'male',
  conditions: ['diabetes'],
  language: 'pt',
  avatar: undefined,
};

const initialDailyProgress: DailyProgress = {
  consumed: { calories: 0, carbs: 0, protein: 0, fat: 0 },
  // Goals could be personalized based on healthProfile later
  goals: { calories: 2000, carbs: 250, protein: 120, fat: 60 }
};

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Login);
  const [healthProfile, setHealthProfile] = useState<HealthProfile | null>(mockProfile);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [language, setLanguage] = useState<LanguageCode>(healthProfile?.language || 'pt');

  const [dailyProgress, setDailyProgress] = useState<DailyProgress>(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('progressDate');
    const storedProgressJSON = localStorage.getItem('dailyProgress');

    if (storedDate === today && storedProgressJSON) {
      try {
        const storedProgress = JSON.parse(storedProgressJSON);
        if (storedProgress.consumed && storedProgress.goals) {
          return storedProgress;
        }
      } catch (e) {
        console.error("Failed to parse stored progress:", e);
        return initialDailyProgress;
      }
    }
    return initialDailyProgress;
  });

  useEffect(() => {
    if (healthProfile?.language) {
      setLanguage(healthProfile.language);
    }
  }, [healthProfile]);


  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('dailyProgress', JSON.stringify(dailyProgress));
    localStorage.setItem('progressDate', today);
  }, [dailyProgress]);

  const addFoodToProgress = (nutrition: { calories: number; carbs: number; protein: number; fat: number; }) => {
    setDailyProgress(prev => ({
      ...prev,
      consumed: {
        calories: prev.consumed.calories + nutrition.calories,
        carbs: prev.consumed.carbs + nutrition.carbs,
        protein: prev.consumed.protein + nutrition.protein,
        fat: prev.consumed.fat + nutrition.fat,
      }
    }));
  };

  const t = (key: string): string => {
    const langFile = translations[language] as Record<string, string> || translations.pt;
    return langFile[key] || key;
  };
  
  const value = {
    currentScreen,
    setCurrentScreen,
    healthProfile,
    setHealthProfile,
    analysisResult,
    setAnalysisResult,
    capturedImage,
    setCapturedImage,
    language,
    setLanguage,
    dailyProgress,
    addFoodToProgress,
    t
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};