import { GoogleGenAI } from '@google/genai';
import { ApiError } from '../ApiError.js';
import { logger } from '../logger.js';

/**
 * Google Gemini behind the tiny provider interface used by the app:
 *
 *   provider.generate({ system, prompt, maxTokens, temperature }) -> Promise<string>
 *
 * To use another AI company, write a file like this one that returns { name, generate } and pick it in ./index.js.
 */
export function createGeminiProvider({ apiKey, model, timeoutMs, baseUrl }) {
  // baseUrl is only for tests (a local fake server); in production the SDK's own address is used.
  const client = new GoogleGenAI({ apiKey, ...(baseUrl && { httpOptions: { baseUrl } }) });

  return {
    name: `gemini:${model}`,

    async generate({ system, prompt, maxTokens = 500, temperature = 0.4 }) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await client.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction: system,
            temperature,
            maxOutputTokens: maxTokens,
            abortSignal: controller.signal,
            // Short rewrite task: "thinking" would use up the token budget and can leave the answer empty.
            thinkingConfig: { thinkingBudget: 0 },
          },
        });
        const text = response.text?.trim();
        if (!text) throw new ApiError(502, 'AI_EMPTY', 'The AI did not return any text. Please try again.');
        return text;
      } catch (err) {
        if (err instanceof ApiError) throw err;
        if (controller.signal.aborted) throw new ApiError(504, 'AI_TIMEOUT', 'The AI took too long to answer. Please try again.');

        logger.warn('[ai] provider error:', err?.status ?? '', err?.message?.slice(0, 200) ?? err);
        if (err?.status === 429) throw new ApiError(503, 'AI_BUSY', 'The AI service is busy right now. Please try again in a minute.');
        throw new ApiError(502, 'AI_FAILED', 'The AI service could not answer. Please try again.');
      } finally {
        clearTimeout(timer);
      }
    },
  };
}
