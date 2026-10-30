import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ATS_RULES, SECTION_ORDER, bandLabel, evaluateAts, expectedImprovement, isActionVerb, sentencesOf, usesFirstPerson } from './engine.js';

const good = () => ({
  personalInformation: { fullName: 'Ada Lovelace', email: 'ada@example.com', phone: '+880 1700 000000', location: 'Dhaka', professionalTitle: 'Senior UI/UX Designer', linkedin: 'linkedin.com/in/ada', website: 'ada.dev' },
  professionalSummary:
    'Senior UI/UX Designer with seven years of experience designing web and mobile products for startups and large companies. Skilled in Figma, user research and design systems. Focused on clear, accessible interfaces that people enjoy using and that businesses can measure.',
  workExperience: [
    {
      id: 'j1', companyName: 'Acme', jobTitle: 'Senior Designer', startDate: '2021-01-01', endDate: '', currentlyWorking: true,
      jobDescription: 'Led a team of 5 designers.\nBuilt a design system in Figma used by 12 products.\nReduced onboarding drop-off by 30%.',
    },
  ],
  education: [{ id: 'e1', institutionName: 'University of Dhaka', degree: 'BSc', startDate: '2012-01-01', endDate: '2016-01-01' }],
  projects: [{ id: 'p1', projectName: 'Shop', projectDescription: 'An online shop built with React.', keyResponsibilities: '', technologies: ['React', 'Node.js'] }],
  skills: ['Figma', 'User research', 'Design systems', 'React', 'Prototyping', 'Accessibility', 'HTML', 'CSS'],
  languages: [{ id: 'l1', name: 'English', level: 'Fluent' }],
  references: [{ id: 'r1', name: 'Sam' }],
});

test('the points of all rules add up to exactly 100', () => {
  assert.equal(ATS_RULES.reduce((sum, rule) => sum + rule.points, 0), 100);
  assert.deepEqual([...new Set(ATS_RULES.map((rule) => rule.section))].sort(), [...SECTION_ORDER].sort());
});

test('rule ids are unique and every rule has a suggestion and a benefit', () => {
  assert.equal(new Set(ATS_RULES.map((r) => r.id)).size, ATS_RULES.length);
  for (const rule of ATS_RULES) assert.ok(rule.suggestion && rule.benefit && rule.title, rule.id);
});

test('an empty resume scores 0, nothing is complete, and it never crashes on missing data', () => {
  for (const content of [{}, undefined, { workExperience: null }, { skills: [null, ''] }]) {
    const result = evaluateAts(content ?? {});
    assert.equal(result.score, 0);
    assert.ok(Object.values(result.sections).every((s) => !s.complete));
  }
});

test('a complete, well written resume scores 100 and has nothing left to improve', () => {
  const result = evaluateAts(good());
  assert.equal(result.score, 100);
  assert.equal(result.label, 'Excellent');
  assert.equal(expectedImprovement(result).points, 0);
  assert.ok(Object.values(result.sections).every((s) => s.complete && s.percent === 100));
});

test('the section scores add up to the overall score', () => {
  const content = good();
  content.professionalSummary = 'Designer.';
  content.skills = ['A', 'B'];
  const result = evaluateAts(content);
  assert.equal(Object.values(result.sections).reduce((sum, s) => sum + s.earned, 0), result.score);
});

test('expected improvement always matches the rules: fixing everything reaches exactly 100', () => {
  for (const content of [{}, { professionalSummary: 'I like design' }, { ...good(), skills: ['A'], references: [] }]) {
    const result = evaluateAts(content);
    const all = expectedImprovement(result);
    assert.equal(result.score + all.points, 100);
    assert.equal(all.newScore, 100);
    // per section: the section's gap is its max minus what it earned
    for (const id of SECTION_ORDER) {
      const s = result.sections[id];
      assert.equal(expectedImprovement(result, id).points, s.max - s.earned);
    }
  }
});

test('contact: the suggestion names what is missing', () => {
  const content = good();
  content.personalInformation.phone = '';
  content.personalInformation.location = '';
  const rule = evaluateAts(content).sections.personalInformation.rules.find((r) => r.id === 'contact-complete');
  assert.equal(rule.earned, 6);
  assert.match(rule.suggestion, /a phone number, your location/);
});

test('summary length tiers and first-person words', () => {
  const words = (n) => Array.from({ length: n }, () => 'word').join(' ');
  const earned = (summary) => evaluateAts({ professionalSummary: summary }).sections.professionalSummary.rules.find((r) => r.id === 'summary-length').earned;
  assert.deepEqual([0, 10, 30, 60, 120, 200].map((n) => earned(words(n))), [0, 2, 5, 8, 5, 2]);
  const noI = (summary) => evaluateAts({ professionalSummary: summary }).sections.professionalSummary.rules.find((r) => r.id === 'summary-no-first-person').earned;
  assert.equal(noI('I am a designer.'), 0);
  assert.equal(noI('Designer with five years of experience.'), 3);
  assert.equal(noI(''), 0);
});

test('usesFirstPerson ignores things like "i.e." and words that only contain "we"', () => {
  assert.equal(usesFirstPerson('Used tools, i.e. Figma, to design webs.'), false);
  assert.equal(usesFirstPerson('Worked with our team'), true);
  assert.equal(usesFirstPerson('I led the project'), true);
  assert.equal(usesFirstPerson('Delivered 3 projects on time'), false);
});

test('action verbs: past, present, -ing, irregular forms', () => {
  for (const verb of ['Led', 'Built', 'Designed', 'Optimised', 'manages', 'Building', 'Reduced', 'Wrote', 'Shipped', 'Spearheaded']) assert.equal(isActionVerb(verb), true, verb);
  for (const word of ['Responsible', 'Team', 'The', 'Various', '']) assert.equal(isActionVerb(word), false, word);
});

test('action verb tiers across job points', () => {
  const rule = (description) =>
    evaluateAts({ workExperience: [{ id: 'j', companyName: 'A', jobTitle: 'B', jobDescription: description }] }).sections.workExperience.rules.find((r) => r.id === 'action-verbs').earned;
  assert.equal(rule('Led a team.\nBuilt an app.\nDesigned a logo.'), 6);
  assert.equal(rule('Led a team.\nResponsible for the app.\nWorked on logos.'), 2);
  assert.equal(rule('Responsible for the app.\nTeam player.'), 0);
  assert.equal(rule(''), 0);
});

test('numbers: years do not count as achievements, percentages and counts do', () => {
  const quantified = (description) =>
    evaluateAts({ workExperience: [{ id: 'j', companyName: 'A', jobTitle: 'B', jobDescription: description }] }).sections.workExperience.rules.find((r) => r.id === 'quantified').earned;
  assert.equal(quantified('Joined in 2021.\nWorked on the app.'), 0);
  assert.equal(quantified('Led 5 designers.'), 2);
  assert.equal(quantified('Led 5 designers.\nCut costs 20%.\nServed 1,000 users.'), 4);
});

test('dates: a missing or reversed range fails, "currently working" needs no end date', () => {
  const dates = (job) => evaluateAts({ workExperience: [{ id: 'j', companyName: 'A', jobTitle: 'B', ...job }] }).sections.workExperience.rules.find((r) => r.id === 'consistent-dates').earned;
  assert.equal(dates({ startDate: '2020-01-01', endDate: '2021-01-01' }), 2);
  assert.equal(dates({ startDate: '2020-01-01', currentlyWorking: true }), 2);
  assert.equal(dates({ startDate: '2022-01-01', endDate: '2021-01-01' }), 0);
  assert.equal(dates({ startDate: '', endDate: '2021-01-01' }), 0);
});

test('skills: count tiers and "used in context"', () => {
  const skills = (list, extra = {}) => evaluateAts({ skills: list, ...extra }).sections.skills.rules;
  const count = (n) => skills(Array.from({ length: n }, (_, i) => `skill${i}`)).find((r) => r.id === 'skills-count').earned;
  assert.deepEqual([0, 1, 3, 5, 8, 20].map(count), [0, 2, 4, 7, 10, 10]);
  const context = skills(['React', 'Figma', 'SQL'], { professionalSummary: 'I use React and Figma and SQL daily' }).find((r) => r.id === 'skills-in-context');
  assert.equal(context.earned, 5);
});

test('section "complete" flags and the missing hint', () => {
  const result = evaluateAts({ personalInformation: { fullName: 'Ada', email: 'bad' } });
  assert.equal(result.sections.personalInformation.complete, false);
  assert.match(result.sections.personalInformation.missing, /full name and a valid email/);
  assert.equal(evaluateAts({ personalInformation: { fullName: 'Ada', email: 'a@b.co' } }).sections.personalInformation.complete, true);
});

test('sentencesOf splits lines and sentences, drops bullet marks', () => {
  assert.deepEqual(sentencesOf('- Led a team. Built an app.\n• Shipped v2'), ['Led a team.', 'Built an app.', 'Shipped v2']);
  assert.deepEqual(sentencesOf('Used node.js and e.g. React'), ['Used node.js and e.g. React']);
});

test('bandLabel', () => {
  assert.deepEqual([0, 39, 40, 60, 80, 90, 100].map(bandLabel), ['Needs work', 'Needs work', 'Fair', 'Good', 'Very good', 'Excellent', 'Excellent']);
});
