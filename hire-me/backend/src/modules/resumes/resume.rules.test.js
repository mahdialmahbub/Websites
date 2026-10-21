import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkReadyToGenerate } from './resume.rules.js';

const valid = {
  personalInformation: { fullName: 'Ada Lovelace', email: 'ada@example.com' },
  professionalSummary: 'Engineer.',
  workExperience: [],
  education: [],
  projects: [],
  skills: [],
};

test('a complete resume is ready', () => {
  assert.deepEqual(checkReadyToGenerate(valid), {});
});

test('name and e-mail are required, e-mail must look valid', () => {
  const errors = checkReadyToGenerate({ ...valid, personalInformation: { fullName: ' ', email: 'ada@' } });
  assert.ok(errors['personalInformation.fullName']);
  assert.ok(errors['personalInformation.email']);
  assert.ok(checkReadyToGenerate({ ...valid, personalInformation: { fullName: 'A', email: '' } })['personalInformation.email']);
});

test('an empty body is not ready', () => {
  const errors = checkReadyToGenerate({ ...valid, professionalSummary: '' });
  assert.ok(errors._);
});

test('any one content section is enough', () => {
  assert.deepEqual(checkReadyToGenerate({ ...valid, professionalSummary: '', skills: ['React'] }), {});
});

test('end date before start date is rejected, "currently working" (empty end) is fine', () => {
  const bad = checkReadyToGenerate({ ...valid, workExperience: [{ startDate: '2024-05-01', endDate: '2023-01-01' }] });
  assert.ok(bad['workExperience.0.endDate']);
  const ok = checkReadyToGenerate({ ...valid, workExperience: [{ startDate: '2024-05-01', endDate: '' }] });
  assert.deepEqual(ok, {});
});
