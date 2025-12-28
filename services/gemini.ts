
import { GoogleGenAI } from "@google/genai";
import { AppState, TaskType } from "../types";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeApiaryData = async (
  apiaryName: string,
  logs: any[],
  hives: any[],
  prompt?: string
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Error: API Key not configured.";

  const context = `
    You are an expert beekeeping consultant AI. 
    Data for Apiary: ${apiaryName}
    Hives count: ${hives.length}
    Recent Logs: ${JSON.stringify(logs.slice(0, 5))}
    
    The user is asking: ${prompt || "Provide a summary of the apiary health and suggest next steps based on the logs."}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error analyzing the data.";
  }
};

export const getBeekeepingAdvice = async (question: string, language: string = 'en'): Promise<string> => {
    const ai = getAIClient();
    if (!ai) return "Error: API Key not configured.";
  
    const langPrompt = language === 'es' ? "Answer in Spanish." : "Answer in English.";

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are a helpful beekeeping assistant. ${langPrompt} Answer this briefly and practically: ${question}`,
      });
      return response.text || "No advice generated.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Sorry, I am having trouble connecting to the hive mind.";
    }
  };
