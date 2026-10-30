"use client";

import { useDeferredValue, useMemo } from "react";
import { useSelector } from "react-redux";
import { evaluateAts } from "@/resume/ats/engine";

/**
 * The live ATS result of the draft: { score, label, sections }. It is the same pure function the server uses
 * to save the final score, so the number here is the number that gets saved.
 * (useDeferredValue keeps typing smooth: the score follows a moment after the last key.)
 */
export function useAts() {
  const content = useSelector((state) => state.builder.content);
  const deferred = useDeferredValue(content);
  return useMemo(() => evaluateAts(deferred), [deferred]);
}
