import { ApiError } from '../../lib/ApiError.js';
import { FIELDS } from './ai.fields.js';
import { checkOutput, cleanOutput } from './ai.output.js';
import { buildPrompt, renderContext, SYSTEM_PROMPT } from './ai.prompt.js';

const MIN_TEXT_TO_IMPROVE = 10; // shorter than this there is nothing to improve: it is treated as "write it for me"

/** 'improve' when there is real text, otherwise 'generate' (needs enough context), otherwise a helpful 422. */
export function decideMode({ field, text, context }) {
  if (text.length >= MIN_TEXT_TO_IMPROVE) return 'improve';
  if (FIELDS[field].enough(context)) return 'generate';
  throw new ApiError(422, 'NOT_ENOUGH_INFO', FIELDS[field].missing);
}

/**
 * Improves (or writes) one description field.
 *
 * Quality gate: the answer is cleaned, then checked - no first-person words and no numbers that are not in the
 * user's text / form data. One retry tells the model what was wrong; a second failure is reported as an error
 * (the old text is never replaced by something unreliable).
 *
 * @param {{ field: string, text: string, context: object }} input
 * @param {{ provider: { generate: Function } | null }} deps
 */
export async function enhanceText({ field, text, context }, { provider }) {
  if (!provider) throw new ApiError(503, 'AI_UNAVAILABLE', 'AI help is not available right now. You can keep writing by hand.');

  const mode = decideMode({ field, text, context });
  const sources = [mode === 'improve' ? text : '', renderContext(field, context)];

  let fixNotes;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const raw = await provider.generate({
      system: SYSTEM_PROMPT,
      prompt: buildPrompt({ field, mode, text, context, fixNotes }),
      maxTokens: 700,
      temperature: attempt === 1 ? 0.4 : 0.2,
    });
    const output = cleanOutput(raw, field);
    const problems = checkOutput(output, { field, sources });
    if (problems.length === 0) return { text: output, mode, field };
    fixNotes = problems.join('; ');
  }

  throw new ApiError(502, 'AI_BAD_OUTPUT', 'The AI could not write a reliable result this time. Your text was not changed. Please try again.');
}
