

import { GoogleGenAI, Type, Modality } from "@google/genai";
import { HealthProfile, AnalysisResult, LanguageCode, Languages } from '../types';

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

export const analyzeFoodImage = async (
  base64Image: string,
  profile: HealthProfile,
  language: LanguageCode
): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not set");
  }

  const ai = new GoogleGenAI({ apiKey:AIzaSyBWH2X-5vV7gQyFVpTk8dj5g6ipq1_Dfq4 });
  const imagePart = fileToGenerativePart(base64Image.split(',')[1], 'image/jpeg');
  
  const languageName = Languages[language] || 'Portuguese';

  const prompt = `Based on the user's health profile below, analyze the food in the image.

User Profile:
- Age: ${profile.age}
- Gender: ${profile.gender}
- Health Conditions: ${profile.conditions.join(', ')}

Please provide a detailed analysis of the food. All text responses must be in ${languageName}.
If the food's alert level is 'RED' or 'YELLOW', provide a list of 3 healthier substitutes.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING, description: "The name of the identified food item." },
            nutrition: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.STRING, description: "Estimated calories (e.g., '250 kcal')." },
                carbs: { type: Type.STRING, description: "Estimated carbohydrates (e.g., '30g')." },
                sugar: { type: Type.STRING, description: "Estimated sugar (e.g., '15g')." },
                fat: { type: Type.STRING, description: "Estimated fat (e.g., '10g')." },
                sodium: { type: Type.STRING, description: "Estimated sodium (e.g., '500mg')." },
                protein: { type: Type.STRING, description: "Estimated protein (e.g., '20g')." }
              },
              required: ["calories", "carbs", "sugar", "fat", "sodium", "protein"]
            },
            alertLevel: { type: Type.STRING, description: "One of: 'GREEN', 'YELLOW', or 'RED'." },
            explanation: { type: Type.STRING, description: "A brief explanation for the given alert level, considering the user's health profile." },
            substitutes: {
              type: Type.ARRAY,
              description: "A list of 3 healthier food substitutes. Provide this if the alertLevel is 'RED' or 'YELLOW'. Otherwise, return an empty array.",
              items: { type: Type.STRING }
            }
          },
          required: ["foodName", "nutrition", "alertLevel", "explanation", "substitutes"]
        }
      }
    });
    
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    // Ensure the result conforms to the AnalysisResult type
    return {
        ...result,
        alertLevel: result.alertLevel as AnalysisResult['alertLevel'],
    };

  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    throw new Error("Failed to analyze image.");
  }
};

export const generateSpeech = async (textToSpeak: string): Promise<string | null> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is not set for TTS");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: textToSpeak }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // A friendly and clear voice
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return base64Audio;
    }
    return null;
  } catch (error) {
    console.error("Error generating speech with Gemini:", error);
    return null;
  }
};