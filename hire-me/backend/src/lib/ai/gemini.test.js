import assert from 'node:assert/strict';
import http from 'node:http';
import { after, before, test } from 'node:test';
import { createGeminiProvider } from './gemini.js';

// A tiny fake of the Gemini REST API, so the real SDK code path (request shape, response parsing,
// error mapping, timeout) is exercised without a key or network.
let server;
let baseUrl;
let lastRequest;
let behaviour = { status: 200, body: { candidates: [{ content: { parts: [{ text: '  Led a team of designers.  ' }] }, finishReason: 'STOP' }] } };

before(async () => {
  server = http.createServer((req, res) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', async () => {
      lastRequest = { url: req.url, key: req.headers['x-goog-api-key'], body: JSON.parse(raw || '{}') };
      if (behaviour.delay) await new Promise((resolve) => setTimeout(resolve, behaviour.delay));
      res.writeHead(behaviour.status, { 'content-type': 'application/json' });
      res.end(JSON.stringify(behaviour.body));
    });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const make = (timeoutMs = 5000) => createGeminiProvider({ apiKey: 'test-key', model: 'gemini-test', timeoutMs, baseUrl });

test('sends the system rules, prompt, limits and no-thinking setting; returns trimmed text', async () => {
  behaviour = { status: 200, body: { candidates: [{ content: { parts: [{ text: '  Led a team of designers.  ' }] }, finishReason: 'STOP' }] } };
  const text = await make().generate({ system: 'RULES', prompt: 'WRITE', maxTokens: 321, temperature: 0.3 });
  assert.equal(text, 'Led a team of designers.');
  assert.match(lastRequest.url, /gemini-test:generateContent/);
  assert.equal(lastRequest.key, 'test-key');
  assert.equal(lastRequest.body.contents[0].parts[0].text, 'WRITE');
  assert.equal(lastRequest.body.systemInstruction.parts[0].text, 'RULES');
  assert.equal(lastRequest.body.generationConfig.maxOutputTokens, 321);
  assert.equal(lastRequest.body.generationConfig.thinkingConfig.thinkingBudget, 0);
});

test('an empty answer becomes AI_EMPTY', async () => {
  behaviour = { status: 200, body: { candidates: [{ content: { parts: [{ text: '' }] }, finishReason: 'SAFETY' }] } };
  await assert.rejects(make().generate({ system: 's', prompt: 'p' }), (err) => err.code === 'AI_EMPTY');
});

test('429 from the provider becomes AI_BUSY, other errors AI_FAILED (no provider details leak)', async () => {
  behaviour = { status: 429, body: { error: { code: 429, message: 'quota exceeded for project 123', status: 'RESOURCE_EXHAUSTED' } } };
  await assert.rejects(make().generate({ system: 's', prompt: 'p' }), (err) => err.code === 'AI_BUSY' && !/123/.test(err.message));
  behaviour = { status: 500, body: { error: { code: 500, message: 'internal secret', status: 'INTERNAL' } } };
  await assert.rejects(make().generate({ system: 's', prompt: 'p' }), (err) => err.code === 'AI_FAILED' && !/secret/.test(err.message));
});

test('a slow answer becomes AI_TIMEOUT', async () => {
  behaviour = { status: 200, delay: 800, body: { candidates: [{ content: { parts: [{ text: 'late' }] } }] } };
  await assert.rejects(make(3000 / 10).generate({ system: 's', prompt: 'p' }), (err) => err.code === 'AI_TIMEOUT');
});
