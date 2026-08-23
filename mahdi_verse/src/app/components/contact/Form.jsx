"use client";

import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import BudgetSelector from "./BudgetSelector";
import Button from "../Button";
import FadeRight from "../motions/FadeRight";
import FadeUp from "../motions/FadeUp";

const Form = () => {
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const formData = new FormData(formRef.current);
    const payload = Object.fromEntries(formData.entries());

    try {
      // 👉 backend connect korar hook point
      // await fetch("/api/contact", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });

      formRef.current?.reset(); // form khali kore dibe
      toast.success("Your information is successfully sent.");
    } catch (err) {
      console.error("Failed to submit form:", err);
      toast.error("Something went wrong. Please try again.");
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
            required
          />
        </FadeRight>
      </FadeRight>
      <FadeRight>
        <FadeRight>
          <label htmlFor="budget" className="inputLabel">
            Budget
          </label>
        </FadeRight>
        <div className="w-full flex flex-wrap gap-4.5">
          <BudgetSelector />
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
        />
      </FadeRight>
      <FadeUp className="space-y-3.5 flex flex-col items-center justify-center">
        <Button
          type="submit"
          fullWidth={true}
          disabled={submitting}
          text={submitting ? "Sending..." : "Let's Work Together"}
        />
        <div className="flex items-center gap-1.5 text-green">
          <i className="fi fi-sr-shield-check text-size-xs_2"></i>
          <p className="font-medium text-size-xs_2">
            Your information is safe and will never be shared.
          </p>
        </div>
      </FadeUp>
    </form>
  );
};

export default Form;