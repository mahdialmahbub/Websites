import { ApiError } from '../lib/ApiError.js';

/** zod error -> ApiError(400) with { fieldErrors: { "path.to.field": ["message"] } } */
export function zodToApiError(error) {
  const fieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.length ? issue.path.join('.') : '_';
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return new ApiError(400, 'VALIDATION_ERROR', 'Some fields are invalid', { fieldErrors });
}

/**
 * validate({ params, query, body }) - each value is a zod schema.
 * The parsed (and cleaned) values land in req.valid.{params,query,body}.
 * (Express 5 makes req.query read-only, so we never overwrite the original request fields.)
 */
export const validate = (schemas) => (req, _res, next) => {
  req.valid = {};
  for (const part of ['params', 'query', 'body']) {
    const schema = schemas[part];
    if (!schema) continue;
    const input = part === 'body' ? (req.body ?? {}) : req[part];
    const result = schema.safeParse(input);
    if (!result.success) throw zodToApiError(result.error);
    req.valid[part] = result.data;
  }
  next();
};
