import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen, HealthProfile, HealthCondition, Languages, LanguageCode } from '../types';
import { Card, Input, Button } from '../components/common';

const healthConditions: { id: HealthCondition; labelKey: string }[] = [
  { id: 'diabetes', labelKey: 'diabetes' },
  { id: 'hypertension', labelKey: 'hypertension' },
  { id: 'cholesterol', labelKey: 'cholesterol' },
  { id: 'obesity', labelKey: 'obesity' },
];

export const ProfileSetupScreen: React.FC = () => {
  const { setCurrentScreen, setHealthProfile, t, language, setLanguage } = useAppContext();
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    dietaryPreferences: '',
  });
  const [selectedConditions, setSelectedConditions] = useState<Set<HealthCondition>>(new Set());
  const [avatar, setAvatar] = useState<string | null>(null);
  const [ageError, setAgeError] = useState<string | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as LanguageCode);
  };

  const handleConditionChange = (condition: HealthCondition) => {
    setSelectedConditions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(condition)) {
        newSet.delete(condition);
      } else {
        newSet.add(condition);
      }
      return newSet;
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAgeError(null);

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 18) {
        setAgeError(t('error_min_age'));
        return;
    }

    const profile: HealthProfile = {
      age: parseInt(formData.age),
      weight: parseInt(formData.weight),
      height: parseInt(formData.height),
      gender: formData.gender,
      dietaryPreferences: formData.dietaryPreferences,
      conditions: Array.from(selectedConditions),
      language: language,
      avatar: avatar || undefined,
    };
    setHealthProfile(profile);
    setCurrentScreen(Screen.UserProfile);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 py-8">
      {/* Hidden inputs for camera and gallery */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={handleFileSelect}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">{t('profileSetupTitle')}</h1>
      <Card className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4 border-4 border-white shadow-md">
              {avatar ? (
                <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <i className="fa-solid fa-user text-5xl text-gray-400"></i>
              )}
            </div>
            <div className="flex space-x-4">
              <button type="button" onClick={() => cameraInputRef.current?.click()} className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-200 transition">
                <i className="fa-solid fa-camera"></i>
                <span>{t('cameraButton')}</span>
              </button>
              <button type="button" onClick={() => galleryInputRef.current?.click()} className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-200 transition">
                <i className="fa-solid fa-images"></i>
                <span>{t('galleryButton')}</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input label={t('ageLabel')} name="age" type="number" value={formData.age} onChange={handleInputChange} required />
              {ageError && <p className="text-red-600 text-sm mt-1 px-1">{ageError}</p>}
            </div>
            <Input label={t('weightLabel')} name="weight" type="number" value={formData.weight} onChange={handleInputChange} required />
            <Input label={t('heightLabel')} name="height" type="number" value={formData.height} onChange={handleInputChange} required />
            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-2">{t('genderLabel')}</label>
              <div className="relative">
                <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full py-3 px-4 bg-gray-100 text-black border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition text-base appearance-none">
                  <option value="male">{t('male')}</option>
                  <option value="female">{t('female')}</option>
                  <option value="other">{t('other')}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                    <i className="fa-solid fa-chevron-down"></i>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-600 text-sm font-semibold mb-2">{t('languageLabel')}</label>
            <div className="relative">
              <select 
                name="language" 
                value={language} 
                onChange={handleLanguageChange} 
                className="w-full py-3 px-4 bg-gray-100 text-black border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition text-base appearance-none"
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

          <Input label={t('dietaryPreferencesLabel')} name="dietaryPreferences" type="text" value={formData.dietaryPreferences} onChange={handleInputChange} />
          
          <div>
            <h3 className="text-gray-600 font-semibold mb-3">{t('healthConditionsTitle')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {healthConditions.map(({ id, labelKey }) => (
                <label key={id} className="flex items-center space-x-3 p-3 bg-gray-100 rounded-full cursor-pointer transition hover:bg-purple-100">
                  <input
                    type="checkbox"
                    checked={selectedConditions.has(id)}
                    onChange={() => handleConditionChange(id)}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded-md border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-gray-700">{t(labelKey)}</span>
                </label>
              ))}
            </div>
          </div>
          <Button type="submit" variant="primary">{t('finishButton')}</Button>
        </form>
      </Card>
    </div>
  );
};