import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';
import { Card, Input, Button } from '../components/common';

export const LoginScreen: React.FC = () => {
  const { setCurrentScreen, t } = useAppContext();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd have auth logic here.
    // For this demo, we'll navigate directly to the camera.
    setCurrentScreen(Screen.Camera);
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://i.postimg.cc/SRZD5Z6b/prato-de-comida-sobre-uma-mesa-em.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <img src="https://i.postimg.cc/jStc4wGj/Glicose.png" alt="GlucoCheck Photo Logo" className="w-24 h-24 mb-4" />
        <h1 className="text-5xl font-bold text-white mb-2">GlucoCheck Photo</h1>
        <p className="text-lg text-gray-200 mb-8">{t('loginTitle')}</p>
        <Card>
          <form onSubmit={handleLogin}>
            <Input label={t('emailLabel')} type="email" placeholder="you@example.com" icon="fa-solid fa-at" required />
            <Input label={t('passwordLabel')} type="password" placeholder="••••••••" icon="fa-solid fa-lock" required />
            <Button type="submit" variant="primary">{t('loginButton')}</Button>
          </form>
          <p className="text-center text-gray-600 mt-6">
            {t('noAccount')}{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentScreen(Screen.Register);
              }}
              className="text-purple-600 font-bold hover:underline"
            >
              {t('registerHere')}
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
};