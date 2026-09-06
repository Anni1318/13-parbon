import { NextResponse } from 'next/server';
import { geminiKeyManager } from '@/lib/gemini-key-manager';
export async function GET() {
  const isConfigured = geminiKeyManager.activeKey !== '';
  
  return NextResponse.json({
    configured: isConfigured,
    provider: "Gemini",
    model: "gemini-3.6-flash",
    message: isConfigured 
      ? "Gemini API key is detected." 
      : "Gemini API key is invalid or unavailable. Please provide a real key."
  });
}
