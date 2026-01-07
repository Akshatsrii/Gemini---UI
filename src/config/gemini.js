import { GoogleGenAI } from "@google/genai";

// 1. Initialize the client (API Key is usually read from GOOGLE_API_KEY env)
// But we will pass it explicitly since you are using Vite
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

/**
 * Runs a chat prompt using the latest Gemini 2.5 Flash model.
 * Note: You can also use 'gemini-3-flash' if your region/key supports it.
 */
export async function runChat(prompt) {
  if (!prompt) return "⚠️ Error: Prompt is empty.";

  try {
    // 2. The new method is ai.models.generateContent
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      // Optional: Add thinking or tools here
      config: {
        temperature: 0.7,
      },
    });

    // 3. Simple text retrieval from the response
    return result.text;

  } catch (error) {
    console.error("Gemini SDK Error:", error);
    
    // Specific error handling for better UX
    if (error.message?.includes("404")) {
      return "⚠️ Error: Model not found. Ensure you are using a supported model ID.";
    }
    
    return "⚠️ Error: Unable to fetch response from Gemini.";
  }
}