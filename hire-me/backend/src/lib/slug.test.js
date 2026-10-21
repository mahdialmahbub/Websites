import assert from 'node:assert/strict';
import { test } from 'node:test';
import { slugify } from './slug.js';

test('slugify: case-only differences give the same slug', () => {
  assert.equal(slugify('Modern'), 'modern');
  assert.equal(slugify('MODERN'), slugify('modern'));
});

test('slugify: spaces, symbols, accents', () => {
  assert.equal(slugify('  Modern & Clean!  '), 'modern-and-clean');
  assert.equal(slugify('Café Menu'), 'cafe-menu');
  assert.equal(slugify('a---b'), 'a-b');
});

test('slugify: no latin letters -> empty (caller must reject)', () => {
  assert.equal(slugify('!!!'), '');
  assert.equal(slugify(''), '');
  assert.equal(slugify(undefined), '');
});

test('slugify: never longer than 60 characters and never ends with a dash', () => {
  const slug = slugify('word '.repeat(40));
  assert.ok(slug.length <= 60);
  assert.ok(!slug.endsWith('-'));
});
