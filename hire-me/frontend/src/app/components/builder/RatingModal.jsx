"use client";

import React, { useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import { icons } from "../../../../assets/iconCollection";
import { Textarea } from "../Textarea";

// The three faces of the design, saved as a 1-5 rating.
const EXPERIENCES = [
  { label: "Bad", rating: 1, icon: icons.bad, tone: "bg-orange-500/5 hover:bg-orange-500/10 text-orange-500" },
  { label: "Decent", rating: 3, icon: icons.decent, tone: "bg-violet-500/5 hover:bg-violet-500/10 text-violet-500" },
  { label: "Excellent", rating: 5, icon: icons.happy, tone: "bg-green-500/5 hover:bg-green-500/10 text-green-500" },
];

const COMMENT_MAX = 1000;

/**
 * The review form: how was it (Bad / Decent / Excellent), an optional comment, and for guests an optional name.
 * It only collects and checks the input; the parent sends it.
 *
 *   onSubmit({ rating, comment, guestName, hpField })     onSkip()     submitting      error (text)      thanks (true after sending)
 */
const RatingModal = ({ isGuest = false, onSubmit, onSkip, onContinue, submitting = false, error = "", thanks = false }) => {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [trap, setTrap] = useState(""); // honeypot: real people never see it, so it stays empty
  const [missingRating, setMissingRating] = useState(false);

  if (thanks) {
    return (
      <div role="status" className="flex flex-col items-center gap-space-4 py-6 text-center">
        <i className={`${icons.happy} text-[56px] text-green-500`} aria-hidden="true"></i>
        <h2 className="font-primary text-[clamp(1.5rem,calc(0.485vw+1.386rem),1.75rem)] font-semibold">Thank you!</h2>
        <p className="text-neutral-500">Your feedback helps us make the builder better.</p>
        <Button autoFocus onClick={onContinue}>
          Continue
        </Button>
      </div>
    );
  }

  const submit = (event) => {
    event.preventDefault();
    if (submitting) return;
    if (!rating) {
      setMissingRating(true);
      return;
    }
    onSubmit({ rating, comment: comment.trim(), guestName: isGuest ? name.trim() : "", hpField: trap });
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-[clamp(1.5rem,calc(0.97vw+1.273rem),2rem)]">
      {/* title and subtitle */}
      <div>
        <h2 className="text-[clamp(1.5rem,calc(0.485vw+1.386rem),1.75rem)] font-semibold font-primary mb-space-2">How was your experience?</h2>
        <p className="text-neutral-500 text-[clamp(1rem,calc(0.242vw+0.943rem),1.125rem)]">We’d love to hear what you think!</p>
      </div>

      {/* Experience */}
      <fieldset>
        <legend className="sr-only">Rate your experience</legend>
        <div className="flex items-center gap-space-4 *:flex-1">
          {EXPERIENCES.map((item) => (
            <Button
              key={item.rating}
              type="button"
              icon={item.icon}
              variant="secondary"
              aria-pressed={rating === item.rating}
              onClick={() => {
                setRating(item.rating);
                setMissingRating(false);
              }}
              className={`${item.tone} ${rating === item.rating ? "ring-2 ring-current" : ""}`}
            >
              {item.label}
            </Button>
          ))}
        </div>
        {missingRating && (
          <p role="alert" className="mt-2 text-small text-red-600">
            Please choose how your experience was.
          </p>
        )}
      </fieldset>

      {/* feedback */}
      <Textarea
        aria-label="Your feedback"
        maxLength={COMMENT_MAX}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        helperText={`${comment.length} / ${COMMENT_MAX}`}
        placeholder="Tell us about your experience. What did you like, what could be improved, or how did our AI suggestions and templates help you create your resume?"
      />

      {isGuest && (
        <Input label="Your name (optional)" placeholder="How should we call you?" maxLength={60} value={name} onChange={(event) => setName(event.target.value)} />
      )}

      {/* honeypot: hidden from people and screen readers, bots tend to fill every field */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="hp_field" tabIndex={-1} autoComplete="off" value={trap} onChange={(event) => setTrap(event.target.value)} />
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-red-500/5 p-space-3 text-small text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center gap-space-4 *:flex-1">
        <Button type="button" variant="secondary" onClick={onSkip} disabled={submitting} className="bg-red-500/5 hover:bg-red-500/10 text-red-500">
          Skip
        </Button>
        <Button type="submit" loading={submitting} disabled={submitting}>
          {error ? "Try again" : "Send Feedback"}
        </Button>
      </div>
    </form>
  );
};

export default RatingModal;
