import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiKeyManager {
  private keys: string[] = [];
  private currentIndex: number = 0;

  constructor() {
    // Gather all keys from GEMINI_API_KEY_1 to GEMINI_API_KEY_11
    for (let i = 1; i <= 11; i++) {
      const key = process.env[`GEMINI_API_KEY_${i}`];
      if (key) {
        this.keys.push(key);
      }
    }
    // Also include the primary key if available and not already in the list
    if (process.env.GEMINI_API_KEY && !this.keys.includes(process.env.GEMINI_API_KEY)) {
      this.keys.push(process.env.GEMINI_API_KEY);
    }
  }

  private rotateKey() {
    if (this.keys.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.keys.length;
      console.log(`[GeminiKeyManager] Rotated to API Key index ${this.currentIndex}`);
    }
  }

  public get activeKey(): string {
    if (this.keys.length === 0) {
      return '';
    }
    return this.keys[this.currentIndex];
  }

  public async executeWithFallback<T>(operation: (genAI: GoogleGenerativeAI) => Promise<T>): Promise<T> {
    if (this.keys.length === 0) {
      throw new Error('No Gemini API keys configured in the environment.');
    }

    const maxAttempts = this.keys.length;
    let attempts = 0;
    let lastError: any;

    while (attempts < maxAttempts) {
      try {
        const genAI = new GoogleGenerativeAI(this.activeKey);
        return await operation(genAI);
      } catch (error: any) {
        lastError = error;
        const status = error?.status || error?.response?.status;
        const message = (error?.message || '').toLowerCase();
        
        // Check if the error is related to rate limiting or quota
        if (status === 429 || status === 403 || message.includes('quota') || message.includes('rate limit')) {
          console.warn(`[GeminiKeyManager] API Key failed (attempt ${attempts + 1}/${maxAttempts}): ${message}`);
          this.rotateKey();
          attempts++;
        } else {
          // If it's another error (like 404 for model), don't retry, just throw
          throw error;
        }
      }
    }

    throw new Error(`All Gemini API keys exhausted. Last error: ${lastError?.message}`);
  }
}

export const geminiKeyManager = new GeminiKeyManager();
