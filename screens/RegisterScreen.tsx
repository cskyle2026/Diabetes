
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';
import { Card, Input, Button } from '../components/common';

export const RegisterScreen: React.FC = () => {
  const { setCurrentScreen, t } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError(t('error_password_mismatch'));
      return;
    }

    const letterCount = (password.match(/[a-zA-Z]/g) || []).length;
    const numberCount = (password.match(/[0-9]/g) || []).length;

    if (letterCount < 4 && numberCount < 4) {
      setError(t('error_password_complexity'));
      return;
    }

    // In a real app, you'd have registration logic here.
    setCurrentScreen(Screen.ProfileSetup);
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://i.postimg.cc/SRZD5Z6b/prato-de-comida-sobre-uma-mesa-em.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-5xl font-bold text-white mb-2">GlucoCheck Photo</h1>
        <p className="text-lg text-gray-200 mb-8">{t('registerTitle')}</p>
        <Card>
          <form onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <Input label={t('nameLabel')} name="name" type="text" placeholder="John Doe" icon="fa-solid fa-user" value={formData.name} onChange={handleInputChange} required />
            <Input label={t('emailLabel')} name="email" type="email" placeholder="you@example.com" icon="fa-solid fa-at" value={formData.email} onChange={handleInputChange} required />
            <Input label={t('passwordLabel')} name="password" type="password" placeholder="••••••••" icon="fa-solid fa-lock" value={formData.password} onChange={handleInputChange} required />
            <Input label={t('confirmPasswordLabel')} name="confirmPassword" type="password" placeholder="••••••••" icon="fa-solid fa-lock" value={formData.confirmPassword} onChange={handleInputChange} required />
            <Button type="submit" variant="primary">{t('registerButton')}</Button>
          </form>
          <p className="text-center text-gray-600 mt-6">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentScreen(Screen.Login);
              }}
              className="text-purple-600 font-bold hover:underline"
            >
              &larr; Back to Login
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
};