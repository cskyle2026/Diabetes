import React, { useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';

export const CameraScreen: React.FC = () => {
  const { setCurrentScreen, setCapturedImage, t } = useAppContext();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        if (imageDataUrl) {
          setCapturedImage(imageDataUrl);
          setCurrentScreen(Screen.Result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative h-screen w-full bg-black flex flex-col">
       <button 
        onClick={() => setCurrentScreen(Screen.UserProfile)}
        className="absolute top-6 left-4 text-white z-20 text-xl"
        aria-label="Back to profile"
      >
        <i className="fa-solid fa-arrow-left"></i>
      </button>

      {/* Hidden inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
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

      {/* Main content area */}
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 text-white">
        <i className="fa-solid fa-camera text-8xl text-purple-400 mb-6"></i>
        <h1 className="text-3xl font-bold mb-2">{t('cameraTitle')}</h1>
        <p className="text-gray-300 max-w-xs">{t('cameraInstruction')}</p>
      </div>

      {/* Bottom controls */}
      <div className="w-full py-8 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex justify-around items-center w-full max-w-md mx-auto">
          <button
            onClick={() => galleryInputRef.current?.click()}
            className="flex flex-col items-center justify-center text-white space-y-2"
            aria-label={t('galleryButton')}
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-2xl">
                <i className="fa-solid fa-images"></i>
            </div>
            <span className="text-xs font-semibold uppercase">{t('galleryButton')}</span>
          </button>
          
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 active:bg-gray-200 transition"
            aria-label={t('cameraInstruction')}
          >
          </button>

          <button
            onClick={() => setCurrentScreen(Screen.Settings)}
            className="flex flex-col items-center justify-center text-white space-y-2"
            aria-label={t('settingsButton')}
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-2xl">
                <i className="fa-solid fa-cog"></i>
            </div>
            <span className="text-xs font-semibold uppercase">{t('settingsButton')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};