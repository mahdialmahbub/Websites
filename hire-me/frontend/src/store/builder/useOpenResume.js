'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery } from '../api/authApi';
import { useGetResumeQuery } from '../api/resumeApi';
import { loadResume } from './builderSlice';

/**
 * Open an existing resume in the builder (dashboard "Edit" -> /builder?resume=<id>):
 *
 *   const id = useSearchParams().get('resume');
 *   useOpenResume(id);
 */
export function useOpenResume(id) {
  const dispatch = useDispatch();
  const { data: user } = useGetMeQuery();
  const openId = useSelector((state) => state.builder.resumeId);
  const hydrated = useSelector((state) => state.builder.hydrated);
  const { data: resume, isError, error } = useGetResumeQuery(id, { skip: !id || !user });

  useEffect(() => {
    if (resume && user && hydrated && resume.id !== openId) dispatch(loadResume({ resume, ownerId: user.id }));
  }, [resume, user, hydrated, openId, dispatch]);

  return { isError, error };
}
