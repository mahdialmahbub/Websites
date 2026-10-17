/**
 * textToBullets("Led a team of 5. Cut costs by 3.5%.")  ->  ["Led a team of 5", "Cut costs by 3.5%"]
 *
 * THE RULE: every full stop that ENDS a sentence starts a new bullet.
 * A full stop does NOT end a sentence when it is
 *   - inside a number            3.5 years, v2.1
 *   - inside a word / link       node.js, example.com, john.doe@mail.com   (no space after the dot)
 *   - part of an abbreviation    e.g. i.e. etc. vs. Mr. Dr. approx. U.S. Ph.D.
 * Several dots in a row ("Done...") count as ONE sentence end.
 * Extra: a new line also starts a new bullet, and "- ", "• ", "1. " list markers typed by the user are removed.
 * The final full stop of a bullet is not shown (bullets look cleaner without it).
 *
 * Use this ONE function everywhere a description is shown (templates, preview, PDF, shared page).
 */

// Lower-case, without the final dot. "e.g." is written "e.g".
const ABBREVIATIONS = new Set([
  'e.g', 'i.e', 'etc', 'vs', 'mr', 'mrs', 'ms', 'dr', 'prof', 'sr', 'jr', 'st', 'no', 'approx',
  'inc', 'ltd', 'co', 'corp', 'dept', 'est', 'fig', 'avg', 'min', 'max',
  'u.s', 'u.k', 'a.m', 'p.m', 'ph.d', 'b.sc', 'm.sc', 'b.a', 'm.a',
]);

const CLOSERS = /["')\]\u201D\u2019]/; // quotes / brackets that may follow the dot:  He said "done."
const LIST_MARKER = /^\s*(?:[-*\u2022\u25AA\u25CF]+|\d+[.)])\s+/; // "- ", "* ", "• ", "1. ", "2) "

/** The word that sits right before the dot at `dotIndex` ("e.g", "Dr", "3", ...). */
function wordBefore(line, dotIndex) {
  let start = dotIndex;
  while (start > 0 && !/\s/.test(line[start - 1])) start -= 1;
  return line.slice(start, dotIndex).replace(/^[("'\u201C\u2018[]+/, '');
}

function nextWordStart(line, index) {
  let i = index;
  while (i < line.length && /\s/.test(line[i])) i += 1;
  return line[i]; // undefined at the end of the text
}

/**
 * Is the dot after `word` just part of an abbreviation (so NOT a sentence end)?
 * Single letters are deliberately NOT treated as initials: in a resume "Learned C. Used Go." must be two bullets.
 */
function isAbbreviation(word, upcoming) {
  const lower = word.toLowerCase();
  if (lower === 'etc') return !/[A-Z]/.test(upcoming ?? ''); // "etc. The next point" -> real sentence end
  return ABBREVIATIONS.has(lower);
}

function splitSentences(line) {
  const sentences = [];
  let start = 0;

  for (let i = 0; i < line.length; i += 1) {
    if (line[i] !== '.') continue;

    let lastDot = i; // "..." is one group
    while (line[lastDot + 1] === '.') lastDot += 1;

    let after = lastDot + 1;
    while (after < line.length && CLOSERS.test(line[after])) after += 1;

    // A sentence end needs whitespace (or the end of the text) right after the dot(s).
    // That one rule already protects 3.5, node.js and example.com.
    const endsHere = after >= line.length || /\s/.test(line[after]);
    const upcoming = nextWordStart(line, after);

    if (endsHere && !isAbbreviation(wordBefore(line, i), upcoming)) {
      sentences.push(line.slice(start, after));
      start = after;
    }
    i = lastDot;
  }

  if (start < line.length) sentences.push(line.slice(start));
  return sentences;
}

function tidy(sentence) {
  const text = sentence.replace(/\s+/g, ' ').trim();
  const withoutDots = text.replace(/[.\s]+$/, '');
  // keep the dot of a closing abbreviation: "React, Vue, etc."
  const lastWord = text.replace(/[.\s]+$/, '').split(' ').pop().toLowerCase();
  if (ABBREVIATIONS.has(lastWord) && /\.$/.test(text)) return `${withoutDots}.`;
  return withoutDots.replace(/^[.\s]+/, '');
}

/** @param {string} text  @returns {string[]} one string per bullet (never empty strings) */
export function textToBullets(text) {
  if (typeof text !== 'string') return [];

  const bullets = [];
  for (const rawLine of text.replace(/\r\n?/g, '\n').split('\n')) {
    const line = rawLine.replace(LIST_MARKER, '');
    for (const sentence of splitSentences(line)) {
      const bullet = tidy(sentence);
      if (bullet) bullets.push(bullet);
    }
  }
  return bullets;
}
