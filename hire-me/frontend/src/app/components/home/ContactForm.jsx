"use client";

import { useActionState, useEffect } from "react";
import { Input } from "../Input";
import { Textarea } from "../Textarea";
import { Button } from "../Button";
import { sendContactMessage } from "../../actions/contact";
import toast from "@/lib/toast";

const INITIAL_STATE = {
  success: false,
  error: "",
  fieldErrors: {},
  values: {
    name: "",
    email: "",
    message: "",
  },
};

const ContactForm = () => {
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    INITIAL_STATE,
  );

  const fieldErrors = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.success) {
      toast.success("Thanks! Your message has been sent.", {
        id: "contact-message-success",
        duration: 4000,
      });
    } else if (state.error) {
      toast.error(state.error, {
        id: "contact-message-error",
        duration: 4000,
      });
    }
  }, [state]);
  
  return (
    <form action={formAction} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-6">
        <Input
          label="Full Name"
          name="name"
          placeholder="John Doe"
          labelIcon="fi fi-rr-user"
          defaultValue={state.values?.name ?? ""}
          validation={fieldErrors.name ? "error" : "default"}
          helperText={fieldErrors.name}
          autoComplete="name"
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="yourmail@mail.com"
          labelIcon="fi fi-rr-envelope"
          defaultValue={state.values?.email ?? ""}
          validation={fieldErrors.email ? "error" : "default"}
          helperText={fieldErrors.email}
          autoComplete="email"
          required
        />

        <Textarea
          label="Message"
          name="message"
          placeholder="I want to make a resume that ..."
          labelIcon="fi fi-rr-comment-dots"
          defaultValue={state.values?.message ?? ""}
          validation={fieldErrors.message ? "error" : "default"}
          helperText={fieldErrors.message}
          required
          className="sm:col-span-2"
        />

        {/* Honeypot field for spam protection */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <div className="sm:col-span-2 space-y-space-3">
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Sending..." : "Send Message"}
          </Button>

          <div className="flex items-center max-sm:flex-col justify-center gap-[clamp(0.250rem,calc(0.376vw+0.412rem),0.75rem)]">
            <p className="font-semibold text-green-300 text-[clamp(0.875rem,calc(0.188vw+0.831rem),1rem)]">
              Your information is secure
            </p>

            <span className="size-1.5 rounded-full bg-neutral-400 max-sm:hidden" />

            <p className="font-semibold text-neutral-400 text-[clamp(0.875rem,calc(0.188vw+0.831rem),1rem)]">
              Response within 24 hours
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
