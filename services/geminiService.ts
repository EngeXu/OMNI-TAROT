import { GoogleGenAI, Type } from "@google/genai";
import { DrawnCard, ReadingResponse, SpreadDefinition } from "../types";

// Guidelines: The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelName = "gemini-2.5-flash";

// --- Helper: Clean JSON String ---
const cleanJsonString = (text: string): string => {
  // Remove markdown code blocks if present (e.g. ```json ... ```)
  let cleaned = text.replace(/```json/g, "").replace(/```/g, "");
  return cleaned.trim();
};

// --- Reading Interpretation API ---
export const getReadingInterpretation = async (
  question: string,
  spread: SpreadDefinition,
  cards: DrawnCard[]
): Promise<ReadingResponse> => {
  
  if (!process.env.API_KEY) {
    console.error("API Key is missing. Please check your environment configuration.");
    return {
      overallTheme: "API Key 未配置",
      cardInsights: cards.map(c => ({
        cardName: c.name,
        position: c.positionName,
        interpretation: "请在 Vercel 后台配置 API_KEY 环境变量以使用 AI 解读功能。"
      }))
    };
  }

  const cardsDescription = cards.map(c => 
    `位置 [${c.positionName}]: ${c.name} (${c.isReversed ? "逆位 (Reversed)" : "正位 (Upright)"}) - 含义关键词: ${c.keywords.join(", ")}`
  ).join("\n");

  const prompt = `
    你是一位世界级的专业塔罗占卜师。
    
    用户问题: "${question}"
    使用牌阵: "${spread.name}" - ${spread.description}
    
    抽牌结果:
    ${cardsDescription}
    
    请提供一份专业、深刻的中文塔罗解读。
    
    要求:
    1. **整体核心**: 概括这次占卜揭示的核心信息。
    2. **单牌解析**: 针对每个位置结合牌义进行详细解读。
    
    语气: 客观、神秘、富有洞察力。请使用简体中文。
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallTheme: {
              type: Type.STRING,
              description: "概括这次占卜揭示的核心信息",
            },
            cardInsights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  cardName: { type: Type.STRING },
                  position: { type: Type.STRING },
                  interpretation: { type: Type.STRING, description: "针对该位置的详细解读" },
                },
                required: ["cardName", "position", "interpretation"],
              },
            },
          },
          required: ["overallTheme", "cardInsights"],
        },
      }
    });

    if (response.text) {
      try {
        return JSON.parse(cleanJsonString(response.text)) as ReadingResponse;
      } catch (e) {
        console.error("JSON Parse Error", e);
        throw new Error("Failed to parse AI response");
      }
    } else {
      throw new Error("No response text generated");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      overallTheme: "连接宇宙智慧时遇到干扰",
      cardInsights: cards.map(c => ({
        cardName: c.name,
        position: c.positionName,
        interpretation: "暂时无法获取详细解读，请稍后再试或检查网络连接。"
      }))
    };
  }
};