"use client";

import React from "react";
import { icons } from "../../../../assets/iconCollection";
import { Button } from "../Button";
import Modal from "../Modal";

const BENEFITS = [
  { icon: "fi fi-rr-disk", title: "Your resumes are saved", text: "Everything you create stays in your account, in one place." },
  { icon: "fi fi-rr-edit", title: "Edit any time", text: "Come back later, change anything and keep the same share link." },
  { icon: "fi fi-rr-magic-wand", title: "Auto-fill for the next resume", text: "Your details are ready, so a new resume takes minutes." },
  { icon: "fi fi-rr-devices", title: "Open it on any device", text: "Without an account, a resume can only be opened on this browser." },
];

/**
 * Shown to guests when the share dialog closes: why an account is worth it.
 * Closing it (X / Escape) counts as "Maybe later". Their resume is added to the account automatically at login.
 */
export default function LoginBenefitsModal({ open, onLogin, onRegister, onLater }) {
  return (
    <Modal open={open} onClose={onLater} title="Keep your resume safe with a free account" className="max-w-[40rem]">
      <p className="mb-5 text-neutral-500">Your resume is ready. Log in or create a free account and this resume is added to it automatically.</p>

      <ul className="mb-6 flex flex-col gap-space-3">
        {BENEFITS.map((benefit) => (
          <li key={benefit.title} className="flex items-start gap-space-3 rounded-lg bg-green-500/5 p-space-3">
            <div className="flex size-9.5 shrink-0 items-center justify-center rounded-lg bg-green-500/5 text-body text-green-500/80">
              <i className={benefit.icon} aria-hidden="true"></i>
            </div>
            <div>
              <h3 className="font-primary text-[clamp(0.875rem,calc(0.188vw+0.831rem),1rem)] font-semibold">{benefit.title}</h3>
              <p className="text-[clamp(0.75rem,calc(0.188vw+0.706rem),0.875rem)] text-neutral-500">{benefit.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-space-3">
        <div className="flex items-center gap-space-4 max-sm:flex-col *:flex-1">
          <Button icon={icons.user} onClick={onLogin}>
            Login
          </Button>
          <Button variant="secondary" icon="fi fi-rr-user-add" onClick={onRegister} className="bg-violet-500/5 text-violet-500 hover:bg-violet-500/10">
            Register
          </Button>
        </div>
        <Button variant="text" onClick={onLater} className="text-neutral-500 hover:text-neutral-700">
          Maybe later
        </Button>
      </div>
    </Modal>
  );
}
