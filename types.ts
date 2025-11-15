export enum Screen {
  Login,
  Register,
  ProfileSetup,
  Camera,
  Result,
  Settings,
  UserProfile
}

export type HealthCondition = 'diabetes' | 'hypertension' | 'cholesterol' | 'obesity';

export interface HealthProfile {
  age: number;
  weight: number;
  height: number;
  gender: string;
  dietaryPreferences?: string;
  conditions: HealthCondition[];
  language: LanguageCode;
  avatar?: string;
}

export type AlertLevel = 'GREEN' | 'YELLOW' | 'RED';

export interface NutritionInfo {
  calories: string;
  carbs: string;
  sugar: string;
  fat: string;
  sodium: string;
  protein: string;
}

export interface AnalysisResult {
  foodName: string;
  nutrition: NutritionInfo;
  alertLevel: AlertLevel;
  explanation: string;
  substitutes: string[];
}

export interface DailyProgress {
  consumed: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
  goals: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
}

export const Languages = {
  pt: 'Português',
  en: 'English',
  zh: 'Mandarim (Chinês Simplificado)',
  hi: 'Hindi',
  es: 'Español',
  fr: 'Français',
  ar: 'Árabe',
  bn: 'Bengali',
  ru: 'Russo',
  ja: 'Japonês'
};

export type LanguageCode = keyof typeof Languages;