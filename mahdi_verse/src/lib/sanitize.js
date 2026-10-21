// lib/sanitize.js
import sanitizeHtml from 'sanitize-html'

const OPTIONS = {
  // Everything not listed here (script, img, iframe, style, ...) is removed.
  allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],

  // rel and target must be allowed here too. Attributes added by
  // transformTags are filtered by this list, so without them the
  // link hardening below would be silently stripped.
  allowedAttributes: { a: ['href', 'rel', 'target'] },

  // Block javascript:, data: and any other scheme in links.
  allowedSchemes: ['http', 'https', 'mailto'],

  transformTags: {
    // Always force these values, even if the user typed their own rel/target.
    a: sanitizeHtml.simpleTransform('a', {
      rel: 'ugc nofollow noopener',
      target: '_blank',
    }),
  },
}

/**
 * Cleans untrusted HTML (comments, messages, testimonials, ...) so it
 * is safe to render with dangerouslySetInnerHTML.
 * Always returns a string; non-string input becomes ''.
 */
export function cleanUserHtml(dirty) {
  if (typeof dirty !== 'string') return ''
  return sanitizeHtml(dirty, OPTIONS)
}