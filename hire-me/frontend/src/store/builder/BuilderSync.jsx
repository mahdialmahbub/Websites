'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { clearReturnTo } from '../../lib/returnTo';
import { useGetMeQuery } from '../api/authApi';
import { useGetProfileQuery } from '../api/profileApi';
import { resumeApi, useClaimGuestDataMutation, useCreateResumeMutation, useUpdateResumeMutation } from '../api/resumeApi';
import {
  GUEST_OWNER,
  STORAGE_KEY,
  buildCreateBody,
  buildPatch,
  clearGuestProfile,
  isContentBlank,
  persistable,
  readGuestProfile,
  rememberGuestProfile,
} from './builderModel';
import {
  adoptOwner,
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
 *  2. mirrors every change back to localStorage (and, for guests, keeps their latest information for auto-fill)
 *  3. blank draft  -> pre-fills it from the profile (logged in) or from the guest's saved information
 *  4. unsaved changes -> auto-saves, for guests AND logged-in users. The FIRST save creates the resume on the
 *     server (nothing is created just because the builder was opened: a blank draft is never saved).
 *     Guests are saved under an anonymous httpOnly cookie; at login the server moves those resumes to the account.
 *
 * It lives in the root layout (not on the builder page) on purpose: after login the user may land on another page
 * first - the draft is still claimed.
 */
export default function BuilderSync() {
  const dispatch = useDispatch();
  const store = useStore();
  const builder = useSelector((state) => state.builder);

  const { data: user, isLoading: userLoading } = useGetMeQuery();
  const { data: profile } = useGetProfileQuery(undefined, { skip: !user });
  const [createResume] = useCreateResumeMutation();
  const [updateResume] = useUpdateResumeMutation();
  const [claimGuestData] = useClaimGuestDataMutation();

  // Timers and queued saves read the latest user from here (a ref is updated in an effect, never while rendering).
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

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
      if (!userRef.current) rememberGuestProfile(builder.content);
    }, LOCAL_SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [builder]);

  // A logged-in user no longer needs the "come back to the builder" hint.
  useEffect(() => {
    if (user) clearReturnTo();
  }, [user]);

  // 3a) The stored draft is backed by a server resume of somebody else.
  //     - It was a GUEST resume and the visitor just logged in: the server moved it to the account at login.
  //       Check that really happened; if so keep editing it, if not keep the text and save it as a new resume.
  //     - It belongs to another account (someone else logged in on this browser): start a fresh draft.
  useEffect(() => {
    if (!user || !builder.hydrated || !builder.resumeId || !builder.ownerId || builder.ownerId === user.id) return undefined;

    if (builder.ownerId !== GUEST_OWNER) {
      dispatch(detachResume());
      return undefined;
    }

    let cancelled = false;
    (async () => {
      const result = await dispatch(resumeApi.endpoints.getResume.initiate(builder.resumeId, { forceRefetch: true }));
      if (cancelled) return;
      dispatch(result.data ? adoptOwner(user.id) : detachResume());
    })();
    return () => {
      cancelled = true;
    };
  }, [user, builder.hydrated, builder.resumeId, builder.ownerId, dispatch]);

  // 3b) blank draft -> pre-fill (never overwrites anything the user already typed)
  useEffect(() => {
    if (!builder.hydrated || builder.resumeId || !isContentBlank(builder.content)) return;
    if (user && profile) dispatch(prefillFromProfile(profile));
    else if (!user && !userLoading) {
      const saved = readGuestProfile();
      if (saved) dispatch(prefillFromProfile(saved));
    }
  }, [user, userLoading, profile, builder.hydrated, builder.resumeId, builder.content, dispatch]);

  // 3c) just logged in: hand the guest's latest browser data to the account (tops up the profile, never overwrites),
  //     then forget it. Safe to repeat. The guest's saved resumes were already claimed by the server at login.
  useEffect(() => {
    if (!user) return;
    const saved = readGuestProfile();
    if (!saved) return;
    claimGuestData({ draft: saved })
      .unwrap()
      .then(() => clearGuestProfile())
      .catch(() => {
        /* try again on the next visit */
      });
  }, [user, claimGuestData]);

  // 4) saving. Calls are queued, so two saves never run at the same time.
  const queue = useRef(Promise.resolve());

  const runSave = useCallback(
    async ({ force = false } = {}) => {
      const draft = store.getState().builder;
      const ownerId = userRef.current?.id ?? GUEST_OWNER;
      const counters = { ...draft.dirty };
      const keys = Object.keys(counters);

      try {
        if (!draft.resumeId) {
          // No resume yet: only create one once there is something to keep (or when Generate forces it).
          if (!force && (keys.length === 0 || isContentBlank(draft.content))) return { resumeId: null };
          dispatch(markSaving());
          const { resume, profile: profileResult } = await createResume(buildCreateBody(draft)).unwrap();
          dispatch(attachResume({ id: resume.id, revision: resume.revision, ownerId, counters }));
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
        if (err?.code === 'RESUME_NOT_FOUND' && draft.resumeId) {
          // The resume is gone or is not ours any more (deleted, expired guest cookie, session ended).
          // Keep everything the user typed and save it as a NEW resume on the next autosave.
          dispatch(detachResume());
          return { resumeId: null };
        }
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

  // Wait until we know whether the visitor is logged in, so the first save is never made as the wrong owner.
  const wantsAutosave = builder.hydrated && !userLoading && builder.status !== 'conflict' && Object.keys(builder.dirty).length > 0;

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
