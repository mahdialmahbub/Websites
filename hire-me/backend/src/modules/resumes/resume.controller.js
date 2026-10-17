import { ok } from '../../lib/respond.js';
import * as resumes from './resume.service.js';

export const list = async (req, res) => ok(res, { resumes: await resumes.listResumes(req.user._id) });

export const create = async (req, res) =>
  ok(res, { resume: await resumes.createResume(req.user, req.valid.body) }, 'Resume created', 201);

export const get = async (req, res) =>
  ok(res, { resume: await resumes.getResume(req.user._id, req.valid.params.id) });

export const update = async (req, res) =>
  ok(res, await resumes.updateResume(req.user._id, req.valid.params.id, req.valid.body), 'Saved');

export const duplicate = async (req, res) =>
  ok(res, { resume: await resumes.duplicateResume(req.user, req.valid.params.id) }, 'Resume duplicated', 201);

export const remove = async (req, res) => {
  await resumes.deleteResume(req.user._id, req.valid.params.id);
  ok(res, null, 'Resume deleted');
};
