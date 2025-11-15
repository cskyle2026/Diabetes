import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen, AlertLevel } from '../types';
import { Card, Button, Spinner } from '../components/common';
import { analyzeFoodImage, generateSpeech } from '../services/geminiService';

// Audio decoding helpers from documentation
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


const alertStyles: Record<AlertLevel, { bg: string; text: string; border: string; icon: string }> = {
  GREEN: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500', icon: 'fa-solid fa-check-circle' },
  YELLOW: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500', icon: 'fa-solid fa-exclamation-triangle' },
  RED: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500', icon: 'fa-solid fa-times-circle' },
};

const NutritionItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
    <span className="text-gray-600">{label}</span>
    <span className="font-bold text-gray-800">{value}</span>
  </div>
);

export const ResultScreen: React.FC = () => {
  const { 
    setCurrentScreen, 
    analysisResult, 
    setAnalysisResult,
    capturedImage, 
    setCapturedImage,
    healthProfile,
    language,
    t,
    addFoodToProgress
  } = useAppContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSubstitutes, setShowSubstitutes] = useState(false);

  useEffect(() => {
    if (capturedImage && healthProfile && !analysisResult) {
      const performAnalysisAndSpeech = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const result = await analyzeFoodImage(capturedImage, healthProfile, language);
          setAnalysisResult(result);

          // --- Text-to-Speech Logic ---
          const textToSpeak = `${t(`alert_${result.alertLevel}`)}. ${result.explanation}`;
          try {
            const base64Audio = await generateSpeech(textToSpeak);
            if (base64Audio) {
                const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
                const audioBuffer = await decodeAudioData(
                    decode(base64Audio),
                    outputAudioContext,
                    24000,
                    1,
                );
                const source = outputAudioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputAudioContext.destination);
                source.start();
            }
          } catch (speechError) {
              // Log TTS error but don't block the UI
              console.error("TTS failed, but showing results anyway:", speechError);
          }
          // --- End Text-to-Speech Logic ---

        } catch (err) {
          console.error("Analysis failed:", err);
          setError(t('error_message'));
        } finally {
          setIsLoading(false);
        }
      };
      performAnalysisAndSpeech();
    }
  }, [capturedImage, healthProfile, analysisResult, setAnalysisResult, language, t]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <Spinner />
        <p className="text-purple-600 font-semibold mt-4">{t('analyzing')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{t('error_title')}</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <Button onClick={() => {
          setAnalysisResult(null); // Clear previous result before taking a new photo
          setCurrentScreen(Screen.Camera);
        }} variant="secondary">{t('newPhotoButton')}</Button>
      </div>
    );
  }
  
  if (!analysisResult || !capturedImage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>No analysis data available.</p>
        <Button onClick={() => setCurrentScreen(Screen.Camera)}>Go Back</Button>
      </div>
    );
  }

  const { foodName, nutrition, alertLevel, explanation, substitutes } = analysisResult;
  const styles = alertStyles[alertLevel] || alertStyles.YELLOW;

  const handleSave = () => {
    if (analysisResult) {
      const { nutrition } = analysisResult;
      // Parse nutrient strings into numbers. `parseFloat` handles "250 kcal" correctly.
      const nutritionToAdd = {
        calories: parseFloat(nutrition.calories) || 0,
        carbs: parseFloat(nutrition.carbs) || 0,
        protein: parseFloat(nutrition.protein) || 0,
        fat: parseFloat(nutrition.fat) || 0,
      };
      addFoodToProgress(nutritionToAdd);
    }
    
    // Reset state and navigate
    setAnalysisResult(null);
    setCapturedImage(null);
    setCurrentScreen(Screen.UserProfile);
  }

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://i.postimg.cc/fRZYXG6D/ffgghh.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 h-screen overflow-y-auto p-4 pt-8 pb-24">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">{t('analysisResultTitle')}</h1>
        <div className="max-w-lg mx-auto space-y-6">
          <Card>
            <img src={capturedImage} alt={foodName} className="w-full h-64 object-cover rounded-2xl mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 text-center">{foodName}</h2>
          </Card>

          <Card>
            <h3 className="text-xl font-bold text-purple-600 mb-3">{t('alertTitle')}</h3>
            <div className={`p-4 rounded-xl border-2 ${styles.border} ${styles.bg} ${styles.text}`}>
              <div className="flex items-center">
                <i className={`${styles.icon} text-2xl mr-3`}></i>
                <span className="font-bold text-lg">{t(`alert_${alertLevel}`)}</span>
              </div>
              <p className="mt-2 text-sm">{explanation}</p>
              {(alertLevel === 'RED' || alertLevel === 'YELLOW') && substitutes && substitutes.length > 0 && (
                <button 
                  onClick={() => setShowSubstitutes(true)} 
                  className="mt-4 w-full bg-white/80 backdrop-blur-sm text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-white transition-all shadow-sm active:scale-95"
                >
                  <i className="fa-solid fa-right-left mr-2"></i>
                  {t('substitutesTitle')}
                </button>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold text-purple-600 mb-3">{t('nutritionalInfo')}</h3>
            <div className="space-y-1">
              <NutritionItem label={t('calories')} value={nutrition.calories} />
              <NutritionItem label={t('carbs')} value={nutrition.carbs} />
              <NutritionItem label={t('sugar')} value={nutrition.sugar} />
              <NutritionItem label={t('fat')} value={nutrition.fat} />
              <NutritionItem label={t('sodium')} value={nutrition.sodium} />
              <NutritionItem label={t('protein')} value={nutrition.protein} />
            </div>
          </Card>
          
        </div>
      </div>
      
      {showSubstitutes && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-sm">
            <h3 className="text-2xl font-bold text-purple-600 mb-4">{t('substitutesTitle')}</h3>
            <ul className="list-disc list-inside space-y-3 text-gray-700 mb-6">
              {substitutes.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <Button onClick={() => setShowSubstitutes(false)} variant="primary">{t('ok')}</Button>
          </Card>
        </div>
      )}


      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 border-t border-gray-200 z-20">
          <div className="max-w-lg mx-auto flex space-x-4">
            <Button onClick={() => {
              setAnalysisResult(null);
              setCurrentScreen(Screen.Camera);
            }} variant="secondary">{t('newPhotoButton')}</Button>
            <Button onClick={handleSave} variant="primary">{t('saveAnalysisButton')}</Button>
          </div>
      </div>
    </div>
  );
};