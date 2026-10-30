import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { ATS_RULES, evaluateAts } from './ats.engine.js';

test('the backend copy of the ATS engine is identical to the frontend one (when the frontend is next to the backend)', (t) => {
  const frontendCopy = fileURLToPath(new URL('../../../../frontend/src/resume/ats/engine.js', import.meta.url));
  if (!existsSync(frontendCopy)) return t.skip('frontend folder not found next to backend');
  assert.equal(
    readFileSync(new URL('./ats.engine.js', import.meta.url), 'utf8'),
    readFileSync(frontendCopy, 'utf8'),
    'src/modules/resumes/ats.engine.js and frontend/src/resume/ats/engine.js must stay identical - copy one over the other',
  );
});

test('rule points add up to 100 and an empty resume scores 0', () => {
  assert.equal(ATS_RULES.reduce((sum, rule) => sum + rule.points, 0), 100);
  assert.equal(evaluateAts({}).score, 0);
});

test('a resume with a name, e-mail and phone gets the contact points', () => {
  const { score } = evaluateAts({ personalInformation: { fullName: 'Ada', email: 'ada@example.com', phone: '+880 1700 000000' } });
  assert.equal(score, 8);
});
