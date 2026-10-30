import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildAiRequest, readFieldValue } from './aiContext.js';

const content = {
  personalInformation: { professionalTitle: 'UI/UX Designer' },
  professionalSummary: '',
  targetJob: { title: 'Product Designer' },
  workExperience: [
    { id: 'j1', jobTitle: 'Designer', companyName: 'Acme', employeeType: 'Full-time', jobDescription: 'Did design work for the web team' },
    { id: 'j2', jobTitle: '', companyName: '', jobDescription: '' },
  ],
  education: [{ id: 'e1', degree: 'BSc', institutionName: 'DU', fieldOfStudy: 'CSE', description: '' }],
  projects: [{ id: 'p1', projectName: 'Shop', role: 'Lead', technologies: ['Next.js', 'MongoDB'], keyAchievements: 'Fast pages', keyResponsibilities: '', projectDescription: '' }],
  skills: ['Figma', 'React'],
};

test('summary: gathers title, target job, jobs, education and skills; empty parts are left out', () => {
  const request = buildAiRequest(content, { section: 'professionalSummary' });
  assert.equal(request.field, 'summary');
  assert.equal(request.text, '');
  assert.deepEqual(request.context, {
    professionalTitle: 'UI/UX Designer',
    targetJobTitle: 'Product Designer',
    experience: ['Designer at Acme'],
    education: ['BSc, DU'],
    skills: ['Figma', 'React'],
  });
});

test('job description: uses that job only, plus the skills; the text is the current field text', () => {
  const request = buildAiRequest(content, { section: 'workExperience', itemId: 'j1', field: 'jobDescription' });
  assert.equal(request.field, 'jobDescription');
  assert.equal(request.text, 'Did design work for the web team');
  assert.deepEqual(request.context, { jobTitle: 'Designer', companyName: 'Acme', employeeType: 'Full-time', skills: ['Figma', 'React'] });
});

test('education and project fields map to their own kinds', () => {
  assert.equal(buildAiRequest(content, { section: 'education', itemId: 'e1', field: 'description' }).field, 'educationDescription');
  const project = buildAiRequest(content, { section: 'projects', itemId: 'p1', field: 'keyResponsibilities' });
  assert.equal(project.field, 'projectResponsibilities');
  assert.deepEqual(project.context.technologies, ['Next.js', 'MongoDB']);
  assert.equal(buildAiRequest(content, { section: 'projects', itemId: 'p1', field: 'projectDescription' }).field, 'projectDescription');
});

test('unsupported fields return null; limits are respected', () => {
  assert.equal(buildAiRequest(content, { section: 'projects', itemId: 'p1', field: 'keyAchievements' }), null);
  const many = { ...content, skills: Array.from({ length: 40 }, (_, i) => `skill-${i}`) };
  assert.equal(buildAiRequest(many, { section: 'professionalSummary' }).context.skills.length, 15);
});

test('readFieldValue', () => {
  assert.equal(readFieldValue(content, { section: 'workExperience', itemId: 'j1', field: 'jobDescription' }), 'Did design work for the web team');
  assert.equal(readFieldValue(content, { section: 'workExperience', itemId: 'nope', field: 'jobDescription' }), '');
});
