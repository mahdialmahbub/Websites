import { clearGuestCookie, readGuestId } from '../../lib/guest.js';
import { ok } from '../../lib/respond.js';
import * as resumes from './resume.service.js';
import * as sharing from './share.service.js';

export const list = async (req, res) => ok(res, await resumes.listResumes(req.owner, req.valid.query));

export const create = async (req, res) => {
  const { resume, profile, existing } = await resumes.createResume(req.owner, req.valid.body);
  ok(res, { resume, profile }, existing ? 'Resume already saved' : 'Resume created', existing ? 200 : 201);
};

export const get = async (req, res) => ok(res, { resume: await resumes.getResume(req.owner, req.valid.params.id) });

export const update = async (req, res) =>
  ok(res, await resumes.updateResume(req.owner, req.valid.params.id, req.valid.body), 'Saved');

export const syncProfile = async (req, res) =>
  ok(res, await resumes.syncProfileFromResume(req.owner, req.valid.params.id), 'Profile updated');

export const duplicate = async (req, res) =>
  ok(res, { resume: await resumes.duplicateResume(req.owner, req.valid.params.id) }, 'Resume duplicated', 201);

export const remove = async (req, res) => {
  await resumes.deleteResume(req.owner, req.valid.params.id);
  ok(res, null, 'Resume deleted');
};

export const share = async (req, res) =>
  ok(res, { share: await sharing.enableShare(req.owner, req.valid.params.id, req.valid.body) }, 'Share link ready');

export const unshare = async (req, res) => {
  await sharing.disableShare(req.owner, req.valid.params.id);
  ok(res, null, 'Share link turned off');
};

export const generate = async (req, res) =>
  ok(res, await resumes.generateResume(req.owner, req.valid.params.id, req.valid.body), 'Resume generated');

/** Explicit "claim" (the server also does it by itself at login). Safe to call again and again. */
export const claim = async (req, res) => {
  const result = await resumes.claimGuestResumes(req.user, readGuestId(req), req.valid.body.draft);
  clearGuestCookie(res);
  ok(res, result, result.claimed ? 'Your guest resumes were added to your account' : 'Nothing to claim');
};
