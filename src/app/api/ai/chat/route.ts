import { NextRequest, NextResponse } from 'next/server';
import { geminiKeyManager } from '@/lib/gemini-key-manager';
import panjikaData from '@/data/panjika_full_year_2026_2027.json';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are Purohit-mosai, a knowledgeable, respectful, and friendly virtual Hindu priest for the 13 Parbon festival app. Your goal is to guide users through ALL festival dates, tithis, muhurats, and ritual procedures at any time.
Rule 1: Draw upon comprehensive knowledge from all Indian Hindu calendars (both Purnimanta and Amanta) and standard Panjikas (including BeniMadhab Shil, Gupta Press, Visuddha Siddhanta, Drik Panchang, and general Vedic calendars) to answer ANY type of question asked by users. 
Rule 2: You are fluent in English, Bengali, and Hindi, and should seamlessly adapt to the user's language. 
Rule 3: If asked for specific timings, provide the most widely accepted standard timings and mention that slight variations exist between different Panjika schools or regions in India.
Rule 4: If the get_panjika_data tool cannot find the data in the local dataset, DO NOT give up. Instead, smoothly answer the user's question using your own intrinsic, vast knowledge of Indian panjikas, Hindu calendars, lunar months, and regional festivals.`;

// Simple semantic search fallback for the local JSON
function searchPanjika(query: string) {
  const q = query.toLowerCase();
  if (!Array.isArray(panjikaData)) return { message: "Panjika database unavailable." };

  const results = panjikaData.filter(
    (item: any) =>
      (item.day || '').toLowerCase().includes(q) ||
      (item.rituals || '').toLowerCase().includes(q) ||
      (item.festival || '').toLowerCase().includes(q)
  );
  return results.length > 0 ? results : { message: "No specific Panjika data found for this query." };
}

function normalizeHistoryToGemini(history: any[]) {
  if (!Array.isArray(history)) return [];
  
  const validMessages = history.filter(msg => 
    msg && (msg.role === 'user' || msg.role === 'model') && 
    msg.parts && msg.parts.length > 0 && msg.parts[0].text && msg.parts[0].text.trim() !== ''
  );

  const firstUserIndex = validMessages.findIndex(msg => msg.role === 'user');
  if (firstUserIndex === -1) return [];

  const sliced = validMessages.slice(firstUserIndex);
  
  const normalized = [];
  let expectedRole = 'user';
  
  for (const msg of sliced) {
    if (msg.role === expectedRole) {
      normalized.push({
        role: msg.role,
        parts: [{ text: msg.parts[0].text }]
      });
      expectedRole = expectedRole === 'user' ? 'model' : 'user';
    }
  }

  // Gemini requires the history to end with 'model' if the next message we're sending is from 'user'.
  // However, the `startChat` history just needs to alternate and the last message in history 
  // will be replied to by the `chat.sendMessage(message)`. 
  // If the last message in history is 'user', then `sendMessage` (which adds another 'user' message) 
  // would break the alternation. So history must end with 'model'.
  if (normalized.length > 0 && normalized[normalized.length - 1].role === 'user') {
    normalized.pop();
  }

  return normalized;
}

export async function POST(req: NextRequest) {
  try {
    const { message, history, festival } = await req.json();
    const sanitizedHistory = normalizeHistoryToGemini(history);
    
    const FINAL_SYSTEM_PROMPT = festival 
      ? `${SYSTEM_PROMPT}\n\nCurrent Festival Context: ${festival}` 
      : SYSTEM_PROMPT;

    const tools = [
      {
        functionDeclarations: [
          {
            name: "get_panjika_data",
            description: "Search the latest BeniMadhab Shil Panjika database for 2026/2027 festival dates, tithi timings, and muhurats.",
            parameters: {
              type: "OBJECT",
              properties: {
                query: {
                  type: "STRING",
                  description: "The search query (e.g., 'Durga Puja 2026 dates', 'Sandhi Puja timing', 'Saraswati Puja')"
                }
              },
              required: ["query"]
            }
          }
        ]
      }
    ];

    const resultPayload = await geminiKeyManager.executeWithFallback(async (genAI: GoogleGenerativeAI) => {
      let runToolUsed = false;
      const model = genAI.getGenerativeModel({
        model: "gemini-3.6-flash",
        systemInstruction: FINAL_SYSTEM_PROMPT,
        tools: tools as any
      });

      const chat = model.startChat({
        history: sanitizedHistory,
      });

      let result = await chat.sendMessage(message);
      let response = result.response;
      
      const functionCalls = response.functionCalls();
      
      if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        if (call.name === 'get_panjika_data') {
          runToolUsed = true;
          const query = (call.args as any).query;
          console.log(`[AI Tool Triggered] get_panjika_data({ query: "${query}" })`);
          
          const toolResult = searchPanjika(query);
          
          result = await chat.sendMessage(`[System/Tool Output for get_panjika_data]: ${JSON.stringify(toolResult)}`);
          response = result.response;
        }
      }
      
      return { 
        text: response.text(), 
        toolUsed: runToolUsed 
      };
    });

    let finalMessage = resultPayload.text;

    if (!finalMessage) {
      finalMessage = "Kkhoma korben! I searched the Panjika but couldn't find exact dates for that specific festival. I mainly track major Bengali pujas like Durga Puja, Kali Puja, Saraswati Puja, etc.";
    }

    console.log("[AI Final Text]:", finalMessage);

    return NextResponse.json({ 
      text: finalMessage,
      toolUsed: resultPayload.toolUsed ? 'get_panjika_data' : undefined
    });

  } catch (error: any) {
    console.error('[AI Chat Route Error]:', error);
    
    const isThrottled = error.message?.toLowerCase().includes('rate limit') || 
                        error.message?.toLowerCase().includes('quota') || 
                        error.status === 429;
    const isUnauthorized = error.status === 401 || error.status === 403;

    let errorMessage = error.message || 'Failed to process request';
    if (isThrottled) {
      errorMessage = "Purohit-mosai is currently very busy (high demand). Please wait a moment and try asking again.";
    } else if (isUnauthorized) {
      errorMessage = "API credentials are invalid or unavailable. Please check your keys.";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: isThrottled ? 429 : (isUnauthorized ? 401 : 500) }
    );
  }
}
