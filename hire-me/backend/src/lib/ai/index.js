import { env } from '../../config/env.js';
import { createGeminiProvider } from './gemini.js';

let provider; // created on first use

/** The configured AI provider, or null when no API key is set (the route then answers 503 AI_UNAVAILABLE). */
export function getAiProvider() {
  if (provider !== undefined) return provider;

  if (env.AI_PROVIDER === 'gemini' && env.GEMINI_API_KEY) {
    provider = createGeminiProvider({ apiKey: env.GEMINI_API_KEY, model: env.GEMINI_MODEL, timeoutMs: env.AI_TIMEOUT_MS });
  } else {
    provider = null;
  }
  return provider;
}
