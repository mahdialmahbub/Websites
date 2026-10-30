'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery } from '../api/authApi';
import { useGetResumeQuery } from '../api/resumeApi';
import { GUEST_OWNER } from './builderModel';
import { loadResume } from './builderSlice';

/**
 * Open an existing resume in the builder (/my-resume "Edit" -> /builder?resume=<id>).
 * Works for logged-in users and for guests (a guest can reopen the resumes saved under their cookie).
 *
 *   const id = useSearchParams().get('resume');
 *   const { isLoading, isError, error } = useOpenResume(id);
 */
export function useOpenResume(id) {
  const dispatch = useDispatch();
  const { data: user, isLoading: userLoading } = useGetMeQuery();
  const openId = useSelector((state) => state.builder.resumeId);
  const hydrated = useSelector((state) => state.builder.hydrated);
  const { data: resume, isLoading, isError, error } = useGetResumeQuery(id, { skip: !id || userLoading });

  useEffect(() => {
    if (resume && hydrated && resume.id !== openId) {
      dispatch(loadResume({ resume, ownerId: user?.id ?? GUEST_OWNER }));
    }
  }, [resume, user, hydrated, openId, dispatch]);

  return { isLoading: Boolean(id) && (userLoading || isLoading), isError, error };
}
