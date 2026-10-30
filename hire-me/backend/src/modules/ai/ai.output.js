import { FIELDS } from './ai.fields.js';

/** Turns whatever the model returned into clean plain text in the shape of the field. */
export function cleanOutput(raw, field) {
  const config = FIELDS[field];
  let text = String(raw ?? '')
    .replace(/```[a-z]*\n?|```/gi, '') //                          code fences
    .replace(/\*\*|__|`/g, '') //                                  markdown emphasis
    .replace(/^\s*(here(?:'s| is)[^\n:]*:|summary:|description:|improved[^\n:]*:)\s*/i, ''); // chatty lead-in

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*•–—]|\d+[.)])\s+/, '').trim()) // bullet / numbering marks
    .filter(Boolean);

  // Wrapping quotes around the whole answer
  if (lines.length > 0) {
    const first = lines[0];
    const last = lines[lines.length - 1];
    if (/^["“]/.test(first) && /["”]$/.test(last)) {
      lines[0] = first.replace(/^["“]\s*/, '');
      lines[lines.length - 1] = lines[lines.length - 1].replace(/\s*["”]$/, '');
    }
  }

  // A single line wrapped in quotes
  for (let i = 0; i < lines.length; i += 1) lines[i] = lines[i].replace(/^["“](.*)["”]$/, '$1').trim();

  const ensureStop = (line) => (/[.!?]$/.test(line) ? line : `${line}.`);
  text = config.shape === 'paragraph' ? lines.join(' ') : lines.map(ensureStop).join('\n');
  text = text.replace(/[ \t]+/g, ' ').trim();

  if (text.length > config.max) {
    const cut = text.slice(0, config.max);
    const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('.\n'), cut.lastIndexOf('.'));
    text = (lastStop > config.max * 0.5 ? cut.slice(0, lastStop + 1) : cut).trim();
  }
  return text;
}

const NUMBER = /\d+(?:[.,]\d+)*/g;
const normalizeNumber = (token) => token.replace(/,/g, '');

/** Numbers in `output` that appear nowhere in the allowed source texts (the model made them up). */
export function findInventedNumbers(output, ...sources) {
  const allowed = new Set(sources.flatMap((source) => String(source ?? '').match(NUMBER) ?? []).map(normalizeNumber));
  return [...new Set((output.match(NUMBER) ?? []).map(normalizeNumber))].filter((number) => !allowed.has(number));
}

const FIRST_PERSON = /\b(?:i|me|my|mine|myself|we|our|ours|ourselves|us)\b/i;
// "I" alone is also a roman numeral / initial in rare cases, but in a resume sentence it is the pronoun.

/** @returns {string[]} what is wrong with the output (empty = good). */
export function checkOutput(output, { field, sources }) {
  const problems = [];
  if (!output || output.length < 20) problems.push('the text is empty or too short');
  if (FIRST_PERSON.test(output)) problems.push('it uses first-person words (I, me, my, we, our); rewrite without them');
  const invented = findInventedNumbers(output, ...sources);
  if (invented.length > 0) problems.push(`it contains numbers that were not provided (${invented.join(', ')}); remove them`);
  if (output.length > FIELDS[field].max) problems.push('it is too long');
  return problems;
}
