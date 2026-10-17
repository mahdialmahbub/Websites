'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { clearReturnTo } from '../../lib/returnTo';
import { useGetMeQuery } from '../api/authApi';
import { useGetProfileQuery } from '../api/profileApi';
import { useCreateResumeMutation, useUpdateResumeMutation } from '../api/resumeApi';
import { STORAGE_KEY, buildCreateBody, buildPatch, isContentBlank, persistable } from './builderModel';
import {
  attachResume,
  detachResume,
  hydrateDraft,
  markConflict,
  markError,
  markSaved,
  markSaving,
  prefillFromProfile,
  setNotice,
} from './builderSlice';
import { registerSaver } from './saveBuilderNow';

const LOCAL_SAVE_DELAY_MS = 400;
const AUTOSAVE_DELAY_MS = 800;

/**
 * Mount ONCE, inside <StoreProvider>, in the root layout. It renders nothing and does the plumbing:
 *
 *  1. loads the draft from localStorage (client only, so the server HTML never differs)
 *  2. mirrors every change back to localStorage
 *  3. logged in + blank draft          -> pre-fills it from the profile
 *  4. logged in + unsaved changes      -> auto-saves; the FIRST save creates the resume on the server.
 *     That is how a guest's draft is "claimed" right after login / sign-up (and the API copies it into the profile)
 *
 * It lives in the root layout (not on the builder page) on purpose: after login the user may land on the
 * dashboard first - the draft is still claimed.
 */
export default function BuilderSync() {
  const dispatch = useDispatch();
  const store = useStore();
  const builder = useSelector((state) => state.builder);

  const { data: user } = useGetMeQuery();
  const { data: profile } = useGetProfileQuery(undefined, { skip: !user });
  const [createResume] = useCreateResumeMutation();
  const [updateResume] = useUpdateResumeMutation();

  const userRef = useRef(user);
  userRef.current = user;

  // 1) hydrate from localStorage
  useEffect(() => {
    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    } catch {
      /* damaged JSON -> start fresh */
    }
    dispatch(hydrateDraft(stored));
  }, [dispatch]);

  // 2) mirror to localStorage
  useEffect(() => {
    if (!builder.hydrated) return undefined;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable(builder)));
      } catch {
        /* storage full / blocked - the draft just stays in memory */
      }
    }, LOCAL_SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [builder]);

  // A logged-in user no longer needs the "come back to the builder" hint.
  useEffect(() => {
    if (user) clearReturnTo();
  }, [user]);

  // 3a) the stored resume belongs to somebody else (another account logged in on this browser)
  useEffect(() => {
    if (user && builder.hydrated && builder.resumeId && builder.ownerId && builder.ownerId !== user.id) {
      dispatch(detachResume());
    }
  }, [user, builder.hydrated, builder.resumeId, builder.ownerId, dispatch]);

  // 3b) blank draft + known profile -> pre-fill (never overwrites anything the user already typed)
  useEffect(() => {
    if (user && profile && builder.hydrated && !builder.resumeId && isContentBlank(builder.content)) {
      dispatch(prefillFromProfile(profile));
    }
  }, [user, profile, builder.hydrated, builder.resumeId, builder.content, dispatch]);

  // 4) saving. Calls are queued, so two saves never run at the same time.
  const queue = useRef(Promise.resolve());

  const runSave = useCallback(
    async ({ force = false } = {}) => {
      const currentUser = userRef.current;
      if (!currentUser) return { resumeId: null };

      const draft = store.getState().builder;
      const counters = { ...draft.dirty };
      const keys = Object.keys(counters);

      try {
        if (!draft.resumeId) {
          if (!force && keys.length === 0) return { resumeId: null };
          dispatch(markSaving());
          const { resume, profile: profileResult } = await createResume(buildCreateBody(draft)).unwrap();
          dispatch(attachResume({ id: resume.id, revision: resume.revision, ownerId: currentUser.id, counters }));
          if (profileResult?.updatedSections?.length) {
            dispatch(setNotice({ type: 'profile-saved', sections: profileResult.updatedSections }));
          }
          return { resumeId: resume.id };
        }

        if (keys.length === 0) return { resumeId: draft.resumeId };
        dispatch(markSaving());
        const result = await updateResume({
          id: draft.resumeId,
          revision: draft.revision,
          ...buildPatch(draft, keys),
        }).unwrap();
        dispatch(markSaved({ revision: result.revision, counters }));
        return { resumeId: draft.resumeId };
      } catch (err) {
        dispatch(err?.code === 'REVISION_CONFLICT' ? markConflict(err.message) : markError(err?.message ?? 'Could not save'));
        throw err;
      }
    },
    [createResume, dispatch, store, updateResume],
  );

  const save = useCallback(
    (options) => {
      const next = queue.current.catch(() => {}).then(() => runSave(options));
      queue.current = next;
      return next;
    },
    [runSave],
  );

  useEffect(() => registerSaver(save), [save]);

  const wantsAutosave =
    Boolean(user) && builder.hydrated && builder.status !== 'conflict' && Object.keys(builder.dirty).length > 0;

  // The timer restarts on every change (builder.dirty changes), so we save 800 ms after the user stops typing.
  // After a failed save nothing changes, so there is no retry storm - the next edit retries.
  useEffect(() => {
    if (!wantsAutosave) return undefined;
    const timer = setTimeout(() => {
      save().catch(() => {});
    }, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [wantsAutosave, builder.dirty, save]);

  return null;
}
