'use client';

import { useCallback, useRef, useState } from 'react';
import { useGenerateResumeMutation } from '../api/resumeApi';
import { saveBuilderNow } from './saveBuilderNow';

/**
 * The builder's "Generate" button:
 *
 *   const { generate, isGenerating, error } = useGenerate();
 *   const result = await generate();          // { resume, share: { url, ... }, profile } or null when it failed
 *
 * 1. saves the draft right now (creates the resume if the first autosave did not happen yet),
 * 2. asks the server to generate: it validates, finalizes and returns the share link,
 * 3. works for guests and logged-in users alike.
 *
 * A double click never makes a second resume: calls while one is running are ignored, and the server
 * returns the same resume and the same link for repeated calls anyway.
 */
export function useGenerate() {
  const [generateResume] = useGenerateResumeMutation();
  const [isGenerating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const running = useRef(false);

  const generate = useCallback(
    async ({ hideContact } = {}) => {
      if (running.current) return null;
      running.current = true;
      setGenerating(true);
      setError('');

      try {
        const { resumeId } = await saveBuilderNow();
        if (!resumeId) throw new Error('We could not save your resume. Please check your connection and try again.');
        return await generateResume({ id: resumeId, hideContact }).unwrap();
      } catch (err) {
        const fieldErrors = err?.details?.fieldErrors;
        const first = fieldErrors ? Object.values(fieldErrors).flat()[0] : null;
        setError(first ? `${err.message} ${first}` : err?.message || 'Something went wrong. Please try again.');
        return null;
      } finally {
        running.current = false;
        setGenerating(false);
      }
    },
    [generateResume],
  );

  return { generate, isGenerating, error, clearError: () => setError('') };
}
