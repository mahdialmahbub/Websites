import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isFieldEmpty, planMerge } from './content.js';

test('isFieldEmpty: blanks, empty lists and objects of blanks are empty; numbers are not', () => {
  for (const value of ['', '  ', null, undefined, [], [''], {}, { id: 'x', name: '' }]) assert.equal(isFieldEmpty(value), true);
  for (const value of ['a', ['a'], { name: 'a' }, 0]) assert.equal(isFieldEmpty(value), false);
});

test('planMerge fill: only gaps are filled, existing data is kept', () => {
  const current = { professionalSummary: 'Old summary', skills: [] };
  const incoming = { professionalSummary: 'New summary', skills: ['React'], education: [{ id: '1', institutionName: 'MIT' }] };
  const { set, sections } = planMerge(current, incoming, 'fill');
  assert.equal(set.professionalSummary, undefined);
  assert.deepEqual(set.skills, ['React']);
  assert.ok(set.education);
  assert.deepEqual(sections.sort(), ['education', 'skills']);
});

test('planMerge overwrite: latest non-empty wins, empty never wipes', () => {
  const current = { professionalSummary: 'Old', skills: ['A'] };
  const { set } = planMerge(current, { professionalSummary: 'New', skills: [] }, 'overwrite');
  assert.equal(set.professionalSummary, 'New');
  assert.equal(set.skills, undefined);
});

test('planMerge: personalInformation is merged field by field and empty values never overwrite', () => {
  const current = { personalInformation: { fullName: 'Ada', phone: '123', email: '' } };
  const incoming = { personalInformation: { fullName: 'Ada L.', phone: '', email: 'a@b.co' } };

  const fill = planMerge(current, incoming, 'fill').set.personalInformation;
  assert.equal(fill.fullName, 'Ada'); //  kept
  assert.equal(fill.email, 'a@b.co'); //  gap filled
  assert.equal(fill.phone, '123'); //     not blanked

  const over = planMerge(current, incoming, 'overwrite').set.personalInformation;
  assert.equal(over.fullName, 'Ada L.');
  assert.equal(over.phone, '123');
});

test('planMerge: running the same merge twice changes nothing (idempotent)', () => {
  const incoming = { professionalSummary: 'Hello', skills: ['A'] };
  const first = planMerge({}, incoming, 'fill').set;
  assert.deepEqual(planMerge(first, incoming, 'fill').sections, []);
});
