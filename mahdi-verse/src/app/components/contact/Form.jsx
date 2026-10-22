"use client";

import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import BudgetSelector from "./BudgetSelector";
import Button from "../Button";
import FadeRight from "../motions/FadeRight";
import FadeUp from "../motions/FadeUp";
import { BUDGET_OPTIONS } from "@/src/lib/budgetOptions";

const DEFAULT_BUDGET = BUDGET_OPTIONS[0];
const GENERIC_ERROR = "Something went wrong. Please try again.";

const Form = () => {
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  // Budget state ekhane rakha hoyeche jate submit er por form-er shathe eta-o reset hoy
  const [budget, setBudget] = useState(DEFAULT_BUDGET);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    // BudgetSelector er hidden input thakay budget-o ei payload e ashbe
    const payload = Object.fromEntries(new FormData(formRef.current).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data?.error || GENERIC_ERROR);
        return; // finally block tao cholbe
      }

      formRef.current?.reset();
      setBudget(DEFAULT_BUDGET);
      toast.success("Your information is successfully sent.");
    } catch (err) {
      // fetch e network problem hole ekhane ashbe
      console.error("Failed to submit form:", err);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex-1 space-y-space-7 opacity-0 animate-fade-right"
    >
      {/* name and email */}
      <FadeRight className="flex gap-space-5">
        <FadeRight className="w-full">
          <FadeRight>
            <label htmlFor="name" className="inputLabel">
              Name
            </label>
          </FadeRight>
          <input
            id="name"
            name="name"
            className="mt-space-2"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            minLength={2}
            maxLength={100}
            required
          />
        </FadeRight>
        <FadeRight className="w-full">
          <FadeRight>
            <label htmlFor="email" className="inputLabel">
              Email
            </label>
          </FadeRight>
          <input
            id="email"
            name="email"
            className="mt-space-2"
            type="email"
            placeholder="youremail@gmail.com"
            autoComplete="email"
            maxLength={254}
            required
          />
        </FadeRight>
      </FadeRight>

      <FadeRight>
        <FadeRight>
          {/* Budget e single input nai, tai label er jaygay span + aria-labelledby */}
          <span id="budget-label" className="inputLabel">
            Budget
          </span>
        </FadeRight>
        <div className="w-full flex flex-wrap gap-4.5">
          <BudgetSelector
            labelledBy="budget-label"
            value={budget}
            onChange={setBudget}
          />
        </div>
      </FadeRight>

      <FadeRight className="flex flex-col w-full">
        <FadeRight>
          <label htmlFor="project" className="inputLabel">
            Project Details
          </label>
        </FadeRight>
        <textarea
          id="project"
          name="project"
          className="mt-space-2"
          placeholder="I want a saas website..."
          rows={5}
          minLength={10}
          maxLength={2000}
          required
        />
      </FadeRight>

      {/* Honeypot: manush dekhbe na, kintu bot ta fill kore dey. Fill hole server silently ignore kore */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <FadeUp className="space-y-3.5 flex flex-col items-center justify-center">
        <Button
          type="submit"
          fullWidth={true}
          disabled={submitting}
          text={submitting ? "Sending..." : "Let's Work Together"}
        />
        <div className="flex items-center gap-1.5 text-green">
          <i className="fi fi-sr-shield-check text-size-sm"></i>
          <p className="font-medium text-size-xs_2">
            Your information is safe and will never be shared.
          </p>
        </div>
      </FadeUp>
    </form>
  );
};

export default Form;
