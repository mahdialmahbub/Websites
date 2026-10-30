'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { isContentBlank } from './builderModel';
import { presetDesign, presetTitle, resetBuilder, setDesign } from './builderSlice';
import { useOpenResume } from './useOpenResume';

const TEMPLATE_SLUG = /^[\w-]{1,50}$/;

/**
 * Decides what the builder shows when it opens. Use it ONCE, on the builder page.
 *
 *   /builder                    keep working on the current draft (it is kept in the browser)
 *   /builder?template=<slug>    "Use This": start a NEW resume with that template (any number of resumes per template)
 *   /builder?template=<slug>&title=<text>   the same, with the resume title typed on /create-resume
 *   /builder?new=1              start a NEW, blank resume ("Create new resume" buttons)
 *   /builder?resume=<id>        edit that saved resume
 *
 * Nothing is created on the server by opening the builder: the first save happens when there is content.
 * The ?template / ?new parameters are removed from the address bar once used, so a refresh keeps the draft
 * instead of starting over.
 */
export function useBuilderEntry() {
  const params = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const store = useStore();
  const handled = useRef('');
  const hydrated = useSelector((state) => state.builder.hydrated);

  const resumeId = params.get('resume');
  const open = useOpenResume(resumeId);

  const template = params.get('template');
  const title = params.get('title');
  const wantsNew = params.get('new') === '1';
  const key = params.toString();

  useEffect(() => {
    if (!hydrated || resumeId || (!template && !wantsNew) || handled.current === key) return;
    handled.current = key;

    const slug = template && TEMPLATE_SLUG.test(template) ? template : null;
    const { dirty, content } = store.getState().builder;
    const hasUnsavedWork = Object.keys(dirty).length > 0 && !isContentBlank(content);

    if (hasUnsavedWork) {
      // The previous draft could not be saved (offline?): do not throw it away, just switch its template.
      if (slug) dispatch(setDesign({ templateId: slug }));
    } else {
      dispatch(resetBuilder());
      if (slug) dispatch(presetDesign({ templateId: slug }));
      if (title) dispatch(presetTitle(title));
    }
    router.replace('/builder');
  }, [hydrated, key, resumeId, template, title, wantsNew, dispatch, router, store]);

  return open;
}
