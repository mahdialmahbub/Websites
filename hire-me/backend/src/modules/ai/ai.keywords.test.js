import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseKeywords, suggestKeywords } from './ai.keywords.js';

test('parseKeywords: cleans bullets, quotes, duplicates, sentences and skills the user already has', () => {
  const raw = '1. React, "Next.js"; figma\n- SQL.\nreact\nThis is a long sentence that is not a skill at all, Prototyping, User research';
  assert.deepEqual(parseKeywords(raw, ['Figma']), ['React', 'Next.js', 'SQL', 'Prototyping', 'User research']);
});

test('parseKeywords: at most 12', () => {
  assert.equal(parseKeywords(Array.from({ length: 30 }, (_, i) => `skill${i}`).join(', ')).length, 12);
});

const provider = (answer) => ({ calls: [], generate: async function (request) { this.calls.push(request); return answer; } });

test('suggestKeywords: needs a role, a provider, and enough good keywords', async () => {
  await assert.rejects(suggestKeywords({ skills: [] }, { provider: provider('a, b, c') }), (e) => e.code === 'NOT_ENOUGH_INFO');
  await assert.rejects(suggestKeywords({ professionalTitle: 'Designer' }, { provider: null }), (e) => e.code === 'AI_UNAVAILABLE');
  await assert.rejects(suggestKeywords({ professionalTitle: 'Designer' }, { provider: provider('only one') }), (e) => e.code === 'AI_BAD_OUTPUT');
});

test('suggestKeywords: returns clean keywords and sends the role + already listed skills as data', async () => {
  const fake = provider('Figma, Prototyping, User research, Wireframing');
  const result = await suggestKeywords({ professionalTitle: 'UI Designer', targetJobTitle: 'Product Designer', skills: ['Figma'] }, { provider: fake });
  assert.deepEqual(result.keywords, ['Prototyping', 'User research', 'Wireframing']);
  assert.equal(result.role, 'Product Designer'); // the target job wins over the current title
  assert.match(fake.calls[0].prompt, /ALREADY LISTED: Figma/);
});
