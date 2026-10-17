'use client';

import { useCallback, useState } from 'react';
import { useGetMeQuery } from '../api/authApi';
import { useSyncProfileMutation } from '../api/resumeApi';
import { saveBuilderNow } from './saveBuilderNow';

/**
 * Wire it to the builder's last-step "Generate" button:
 *
 *   const [open, setOpen] = useState(false);
 *   const { generate, isPreparing } = useGenerate(() => setOpen(true));
 *   ...  generate()  ...   <GenerateModal open={open} onClose={() => setOpen(false)} />
 *
 * Logged in: saves the resume right now, then copies its information into the profile
 *            (so the NEXT resume starts pre-filled). Guests: nothing to do - the modal just opens.
 * The modal opens even if saving fails: downloading the PDF never needs the server.
 */
export function useGenerate(onReady) {
  const { data: user } = useGetMeQuery();
  const [syncProfile] = useSyncProfileMutation();
  const [isPreparing, setPreparing] = useState(false);

  const generate = useCallback(async () => {
    setPreparing(true);
    try {
      if (user) {
        const { resumeId } = await saveBuilderNow();
        if (resumeId) await syncProfile(resumeId).unwrap();
      }
    } catch {
      /* the save status indicator already shows the problem */
    } finally {
      setPreparing(false);
      onReady?.();
    }
  }, [onReady, syncProfile, user]);

  return { generate, isPreparing };
}
