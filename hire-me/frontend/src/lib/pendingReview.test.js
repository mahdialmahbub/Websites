import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { clearPendingReview, readPendingReview, rememberPendingReview } from './pendingReview.js';

const memory = new Map();
globalThis.localStorage = { getItem: (k) => memory.get(k) ?? null, setItem: (k, v) => memory.set(k, v), removeItem: (k) => memory.delete(k) };
beforeEach(() => memory.clear());

const ID = 'a'.repeat(24);

test('remember -> read -> clear', () => {
  rememberPendingReview(ID, 1000);
  assert.deepEqual(readPendingReview(1000 + 5 * 60 * 1000), { resumeId: ID });
  clearPendingReview();
  assert.equal(readPendingReview(), null);
});

test('older than a day is ignored; damaged or odd values are ignored', () => {
  rememberPendingReview(ID, 0);
  assert.equal(readPendingReview(25 * 60 * 60 * 1000), null);
  memory.set('rb.pendingReview.v1', '{not json');
  assert.equal(readPendingReview(), null);
  memory.set('rb.pendingReview.v1', JSON.stringify({ resumeId: '<script>', savedAt: Date.now() }));
  assert.equal(readPendingReview(), null);
});

test('an invalid resume id is never stored', () => {
  rememberPendingReview('nope');
  rememberPendingReview(undefined);
  assert.equal(memory.size, 0);
});
