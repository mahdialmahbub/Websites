"use client";

import React, { useEffect, useState } from "react";
import { useCreateReviewMutation } from "@/store/api/reviewApi";
import Modal from "../Modal";
import RatingModal from "./RatingModal";

const THANKS_MS = 2200;

/** The form with its own state: it exists only while the dialog is open, so every opening starts fresh. */
function ReviewBody({ resumeId, isGuest, onDone }) {
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const [error, setError] = useState("");
  const [thanks, setThanks] = useState(false);

  // After "Thank you" the flow goes on by itself (the Continue button does the same, sooner).
  useEffect(() => {
    if (!thanks) return undefined;
    const timer = setTimeout(onDone, THANKS_MS);
    return () => clearTimeout(timer);
  }, [thanks, onDone]);

  const submit = async (input) => {
    setError("");
    try {
      await createReview({ resumeId, ...input }).unwrap();
      setThanks(true);
    } catch (err) {
      setError(err?.message || "We could not send your feedback. Please try again.");
    }
  };

  return <RatingModal isGuest={isGuest} submitting={isLoading} error={error} thanks={thanks} onSubmit={submit} onSkip={onDone} onContinue={onDone} />;
}

/** The review dialog shown after every Generate. Closing it any way (Skip, Escape, X) just continues the flow. */
export default function ReviewModal({ open, resumeId, isGuest, onDone }) {
  return (
    <Modal open={open} onClose={onDone} title="How was your experience?" titleHidden className="max-w-[40rem]">
      <ReviewBody resumeId={resumeId} isGuest={isGuest} onDone={onDone} />
    </Modal>
  );
}
