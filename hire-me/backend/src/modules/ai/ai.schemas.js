import { z } from 'zod';
import { CONTEXT_LABELS, FIELD_NAMES, FIELDS } from './ai.fields.js';

// eslint-disable-next-line no-control-regex
const clean = (value) => value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();

const shortText = z.string().max(300).transform(clean);
const list = z.array(z.string().max(120).transform(clean)).max(30);

/** Free-form context from the form: only known keys are kept, everything is size limited. */
const context = z
  .object(Object.fromEntries(Object.keys(CONTEXT_LABELS).map((key) => [key, z.union([shortText, list]).optional()])))
  .partial()
  .default({});

export const enhanceBody = z
  .object({
    field: z.enum(FIELD_NAMES),
    // The text is limited to what the resume field itself accepts, so nothing longer can be sent to the AI.
    text: z.string().max(2000, 'This text is too long').transform(clean).default(''),
    context,
  })
  .superRefine((body, ctx) => {
    if (body.text.length > FIELDS[body.field].max) {
      ctx.addIssue({ code: 'custom', path: ['text'], message: `This text can have at most ${FIELDS[body.field].max} characters` });
    }
  });

export const keywordsBody = z.object({
  professionalTitle: z.string().max(120).transform(clean).default(''),
  targetJobTitle: z.string().max(120).transform(clean).default(''),
  skills: list.default([]),
});
