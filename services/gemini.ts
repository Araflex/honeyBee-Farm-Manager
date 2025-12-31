
import { GoogleGenAI } from "@google/genai";
import { AppState, TaskType } from "../types";

// Always use a named parameter for the API key and obtain it from process.env.API_KEY.
// Fix: Updated model names and initialization to follow current Google GenAI SDK best practices.
export const analyzeApiaryData = async (
  apiaryName: string,
  logs: any[],
  hives: any[],
  prompt?: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const context = `
    You are an expert beekeeping consultant AI. 
    Data for Apiary: ${apiaryName}
    Hives count: ${hives.length}
    Recent Logs: ${JSON.stringify(logs.slice(0, 5))}
    
    The user is asking: ${prompt || "Provide a summary of the apiary health and suggest next steps based on the logs."}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: context,
    });
    // Accessing the .text property directly from the response.
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error analyzing the data.";
  }
};

export const getBeekeepingAdvice = async (question: string, language: string = 'en'): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
    const langPrompt = language === 'es' ? "Answer in Spanish." : "Answer in English.";

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a helpful beekeeping assistant. ${langPrompt} Answer this briefly and practically: ${question}`,
      });
      // Accessing the .text property directly from the response.
      return response.text || "No advice generated.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Sorry, I am having trouble connecting to the hive mind.";
    }
  };
