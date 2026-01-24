
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export async function generatePotteryImage(
  userPrompt: string, 
  referenceImage: { data: string; mimeType: string; } | null,
  isEdit: boolean = false
): Promise<string> {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    throw new Error("Không tìm thấy API_KEY. Vui lòng cấu hình Environment Variable.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const baseInstructions = `
    Style: Traditional My Thien Pottery from Quang Ngai, Vietnam. 
    Characteristics: Hand-crafted, rustic terracotta or glazed stoneware. 
    Specific glaze: 'Men hỏa biến' (transforming glaze) with rich earthy tones like deep brown, emerald green, or amber.
    Details: High-quality product photography, soft natural studio lighting, simple wooden pedestal background. 
    Avoid: Plastic looks, futuristic styles, or over-perfect factory-made appearance.
  `;

  const parts: any[] = [];

  if (referenceImage) {
    parts.push({
      inlineData: {
        data: referenceImage.data,
        mimeType: referenceImage.mimeType,
      },
    });
    const editPrompt = isEdit 
      ? `Modify the provided My Thien pottery image according to: "${userPrompt}". Keep the material and lighting consistent.`
      : `Create a new My Thien style pottery piece inspired by this shape but with: "${userPrompt}".`;
    parts.push({ text: `${editPrompt} ${baseInstructions}` });
  } else {
    parts.push({ text: `Generate a photorealistic image of a My Thien pottery piece: ${userPrompt}. ${baseInstructions}` });
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
            imageConfig: {
                aspectRatio: "1:1",
            },
        },
    });
    
    const candidate = response.candidates?.[0];
    if (!candidate || !candidate.content || !candidate.content.parts) {
        throw new Error('API không trả về kết quả hợp lệ.');
    }

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error('Không tìm thấy dữ liệu hình ảnh trong phản hồi từ xưởng gốm AI.');
  } catch (error: any) {
    console.error('Gemini Image API Error:', error);
    if (error.message?.includes('403') || error.message?.includes('API_KEY_INVALID')) {
        throw new Error('Xác thực thất bại: API Key không hợp lệ.');
    }
    throw new Error(error.message || 'Lỗi khi kết nối với xưởng gốm AI.');
  }
}