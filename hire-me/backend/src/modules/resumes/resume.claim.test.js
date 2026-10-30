import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';

// The claim logic talks to MongoDB only through two models, so they are replaced by tiny in-memory fakes here.
Object.assign(process.env, { CLIENT_URL: 'http://localhost:3000', MONGODB_URI: 'mongodb://127.0.0.1:1/x', SESSION_SECRET: 'a'.repeat(40), OTP_SECRET: 'b'.repeat(40) });
const { Resume } = await import('./resume.model.js');
const { Profile } = await import('../profile/profile.model.js');
const { claimGuestResumes } = await import('./resume.service.js');

const USER = { _id: 'user-1' };
let resumes; // fake collection
let profiles; // userId -> stored sections
let failProfileWrites;
let moves;

const resume = (id, guestId, updatedAt, content) => ({ _id: id, guestId, updatedAt: new Date(updatedAt), ...content });

beforeEach(() => {
  resumes = [];
  profiles = new Map();
  failProfileWrites = false;
  moves = [];

  Resume.find = (filter) => ({
    sort: () => ({ lean: async () => resumes.filter((r) => r.guestId === filter.guestId).sort((a, b) => b.updatedAt - a.updatedAt) }),
  });
  Resume.updateMany = async (filter, update) => {
    moves.push({ filter, update });
    for (const r of resumes) {
      if (filter._id.$in.includes(r._id) && r.guestId === filter.guestId) {
        r.user = update.$set.user;
        delete r.guestId;
      }
    }
  };
  Profile.findOne = (filter) => ({ lean: async () => (profiles.has(filter.user) ? { ...profiles.get(filter.user) } : null) });
  Profile.findOneAndUpdate = (filter, update) => ({
    lean: async () => {
      if (failProfileWrites) throw new Error('database down');
      const before = profiles.get(filter.user) ?? null;
      profiles.set(filter.user, { ...(before ?? {}), ...update.$set });
      return before;
    },
  });
});

const GUEST = 'g'.repeat(32);

test('moves the guest resumes to the user and fills the profile: newest first, nothing non-empty is overwritten', async () => {
  resumes = [
    resume('old', GUEST, '2026-01-01', { personalInformation: { fullName: 'Old Name', email: 'old@x.co' }, professionalSummary: 'Old summary', skills: ['A'] }),
    resume('new', GUEST, '2026-02-01', { personalInformation: { fullName: 'New Name', email: '' }, professionalSummary: '', skills: ['B'] }),
  ];
  profiles.set(USER._id, { professionalSummary: 'Already on my profile' });

  const result = await claimGuestResumes(USER, GUEST);

  assert.equal(result.claimed, 2);
  const profile = profiles.get(USER._id);
  assert.equal(profile.professionalSummary, 'Already on my profile', 'existing profile data is never overwritten');
  assert.equal(profile.personalInformation.fullName, 'New Name', 'the newest resume fills the gap first');
  assert.equal(profile.personalInformation.email, 'old@x.co', 'a field the newest resume left empty is taken from the older one');
  assert.deepEqual(profile.skills, ['B'], 'a section already filled by a newer resume is not replaced by an older one');
  assert.ok(result.updatedSections.includes('personalInformation') && result.updatedSections.includes('skills'));
  assert.ok(resumes.every((r) => r.user === USER._id && r.guestId === undefined), 'every resume now belongs to the user');
});

test('idempotent: claiming again changes nothing', async () => {
  resumes = [resume('r1', GUEST, '2026-01-01', { professionalSummary: 'Hello', skills: ['A'] })];
  await claimGuestResumes(USER, GUEST);
  const afterFirst = JSON.stringify(profiles.get(USER._id));
  moves.length = 0;

  const second = await claimGuestResumes(USER, GUEST);

  assert.deepEqual(second, { claimed: 0, updatedSections: [] });
  assert.equal(JSON.stringify(profiles.get(USER._id)), afterFirst);
  assert.equal(moves.length, 0, 'nothing to move the second time');
});

test('no guest cookie (expired or never set): nothing is claimed, the browser draft still tops up the profile', async () => {
  const none = await claimGuestResumes(USER, null);
  assert.deepEqual(none, { claimed: 0, updatedSections: [] });

  const withDraft = await claimGuestResumes(USER, null, { professionalSummary: 'From the browser', skills: ['Figma'] });
  assert.equal(withDraft.claimed, 0);
  assert.equal(profiles.get(USER._id).professionalSummary, 'From the browser');
  assert.deepEqual(profiles.get(USER._id).skills, ['Figma']);
});

test('the browser draft is the newest data and wins over older resumes (but never over the profile)', async () => {
  resumes = [resume('r1', GUEST, '2026-01-01', { professionalSummary: 'From an old resume' })];
  await claimGuestResumes(USER, GUEST, { professionalSummary: 'From the browser draft' });
  assert.equal(profiles.get(USER._id).professionalSummary, 'From the browser draft');
});

test('a resume of another guest is never touched', async () => {
  resumes = [resume('mine', GUEST, '2026-01-01', { skills: ['A'] }), resume('theirs', 'z'.repeat(32), '2026-01-02', { skills: ['Z'] })];
  const result = await claimGuestResumes(USER, GUEST);
  assert.equal(result.claimed, 1);
  assert.equal(resumes.find((r) => r._id === 'theirs').guestId, 'z'.repeat(32));
  assert.deepEqual(moves[0].filter._id.$in, ['mine']);
});

test('if the profile cannot be saved, no resume is moved, so a retry finds everything', async () => {
  resumes = [resume('r1', GUEST, '2026-01-01', { professionalSummary: 'Hello' })];
  failProfileWrites = true;
  await assert.rejects(claimGuestResumes(USER, GUEST), /database down/);
  assert.equal(resumes[0].guestId, GUEST, 'still a guest resume');
  assert.equal(moves.length, 0);

  failProfileWrites = false;
  const retry = await claimGuestResumes(USER, GUEST);
  assert.equal(retry.claimed, 1);
  assert.equal(profiles.get(USER._id).professionalSummary, 'Hello');
});
