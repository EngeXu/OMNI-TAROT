import { GoogleGenAI, Type } from "@google/genai";
import { DrawnCard, ReadingResponse, SpreadDefinition } from "../types";

const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });
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
    
    Response format must be valid JSON matching this schema:
    {
      "overallTheme": "string",
      "cardInsights": [
        { "cardName": "string", "position": "string", "interpretation": "string" }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
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
      overallTheme: "当前能量连接受阻，请检查您的网络或API设置。",
      cardInsights: cards.map(c => ({
        cardName: c.name,
        position: c.positionName,
        interpretation: "无法获取详细解读，请凭直觉感受牌面能量。"
      }))
    };
  }
};