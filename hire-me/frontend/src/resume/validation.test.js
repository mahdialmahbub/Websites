import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isValidDate, isValidWebUrl, validateAll, validateSection } from './validation.js';

test('personal information: name and a valid e-mail are required', () => {
  const errors = validateSection('personalInformation', { fullName: ' ', email: 'ada@' });
  assert.equal(errors.fullName, 'Full name is required');
  assert.match(errors.email, /valid email/);
  assert.deepEqual(validateSection('personalInformation', { fullName: 'Ada', email: 'ada@example.com' }), {});
});

test('phone, links: optional but must look right when filled', () => {
  const ok = { fullName: 'A', email: 'a@b.co', phone: '+880 1700-000000', linkedin: 'linkedin.com/in/ada', website: 'ada.dev' };
  assert.deepEqual(validateSection('personalInformation', ok), {});
  const bad = validateSection('personalInformation', { ...ok, phone: 'abc', linkedin: 'example.com/ada', website: 'javascript:alert(1)' });
  assert.ok(bad.phone && bad.linkedin && bad.website);
});

test('isValidWebUrl', () => {
  assert.equal(isValidWebUrl('example.com'), true);
  assert.equal(isValidWebUrl('https://example.com/a?b=1'), true);
  for (const value of ['', 'hello', 'a b.com', 'ftp://x.com', 'javascript:alert(1)', 'http://']) assert.equal(isValidWebUrl(value), false);
});

test('isValidDate', () => {
  assert.equal(isValidDate('2024-02-29'), true);
  assert.equal(isValidDate('2023-02-29'), false);
  assert.equal(isValidDate('2024-13-01'), false);
  assert.equal(isValidDate('01/02/2024'), false);
});

test('work experience: required fields only for entries that have content; ids key the errors', () => {
  const list = [
    { id: 'a', companyName: '', jobTitle: '', startDate: '', endDate: '', currentlyWorking: false },
    { id: 'b', companyName: 'Acme', jobTitle: '', startDate: '2024-05-01', endDate: '2023-01-01', currentlyWorking: false },
  ];
  const errors = validateSection('workExperience', list);
  assert.equal(errors['a.jobTitle'], undefined); //  empty entry is ignored
  assert.equal(errors['b.jobTitle'], 'Job title is required');
  assert.equal(errors['b.endDate'], 'End date cannot be before the start date');
});

test('"currently working" ignores the end date', () => {
  const list = [{ id: 'a', companyName: 'Acme', jobTitle: 'Dev', startDate: '2024-05-01', endDate: '2020-01-01', currentlyWorking: true }];
  assert.deepEqual(validateSection('workExperience', list), {});
});

test('limits match the API (too many entries, too long text)', () => {
  const many = Array.from({ length: 31 }, (_, i) => ({ id: `e${i}`, companyName: 'A', jobTitle: 'B' }));
  assert.match(validateSection('workExperience', many)._, /up to 30/);
  assert.match(validateSection('professionalSummary', 'x'.repeat(2001)).professionalSummary, /2000/);
  assert.match(validateSection('skills', Array.from({ length: 51 }, (_, i) => `s${i}`))._, /50/);
});

test('references: e-mail format, languages: name required', () => {
  assert.ok(validateSection('references', [{ id: 'r', name: 'Sam', email: 'nope' }])['r.email']);
  assert.ok(validateSection('languages', [{ id: 'l', name: '', level: 'Fluent' }])['l.name']);
});

test('validateAll only lists sections with errors', () => {
  const result = validateAll({ personalInformation: { fullName: '', email: '' }, skills: ['a'] });
  assert.deepEqual(Object.keys(result), ['personalInformation']);
});
