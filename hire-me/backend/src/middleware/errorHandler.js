import mongoose from 'mongoose';
import multer from 'multer';
import { env } from '../config/env.js';
import { ApiError } from '../lib/ApiError.js';
import { logger } from '../lib/logger.js';

export function notFound(req, res) {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route not found: ${req.method} ${req.originalUrl}` },
  });
}

function normalize(err) {
  if (err instanceof ApiError) {
    return { status: err.status, code: err.code, message: err.message, details: err.details };
  }
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return { status: 413, code: 'FILE_TOO_LARGE', message: 'The image is too large (max 3 MB)' };
    }
    return { status: 400, code: 'UPLOAD_ERROR', message: err.message };
  }
  if (err?.type === 'entity.parse.failed') {
    return { status: 400, code: 'INVALID_JSON', message: 'The request body is not valid JSON' };
  }
  if (err?.type === 'entity.too.large') {
    return { status: 413, code: 'PAYLOAD_TOO_LARGE', message: 'The request body is too large' };
  }
  if (err instanceof mongoose.Error.ValidationError) {
    const fieldErrors = Object.fromEntries(
      Object.entries(err.errors).map(([path, e]) => [path, [e.message]]),
    );
    return { status: 400, code: 'VALIDATION_ERROR', message: 'Some fields are invalid', details: { fieldErrors } };
  }
  if (err instanceof mongoose.Error.CastError) {
    return { status: 400, code: 'INVALID_ID', message: 'Invalid identifier' };
  }
  if (err?.code === 11000) {
    return { status: 409, code: 'DUPLICATE', message: 'This record already exists' };
  }
  return { status: 500, code: 'INTERNAL_ERROR', message: 'Something went wrong on our side. Please try again.' };
}

// Express recognises error handlers by their 4 arguments - keep `next` even though it is unused.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const { status, code, message, details } = normalize(err);
  if (status >= 500) logger.error(`${req.method} ${req.originalUrl}`, err);

  if (details?.retryAfterSeconds) res.set('Retry-After', String(details.retryAfterSeconds));

  const error = { code, message };
  if (details) error.details = details;
  if (!env.isProd && status >= 500) error.stack = err?.stack;

  res.status(status).json({ success: false, error });
}
