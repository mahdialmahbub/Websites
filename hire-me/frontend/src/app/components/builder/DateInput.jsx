"use client";

import { useState } from "react";
import { Input } from "../Input";
import Modal from "../Modal";
import { DatePicker } from "./DatePicker";

// The resume state keeps dates as "YYYY-MM-DD" strings (what <input type="date"> gave),
// so this component talks in strings and only uses Date objects inside.
const pad = (n) => String(n).padStart(2, "0");

const toISO = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

function parseISO(value) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

const formatDate = (date, precision) =>
  date.toLocaleDateString("en-GB", {
    ...(precision === "month" ? {} : { day: "numeric" }),
    month: "short",
    year: "numeric",
  });

/**
 * Drop-in replacement for <Input type="date" />.
 * Shows the chosen date in your Input; clicking it opens the DatePicker in a Modal.
 *
 * - `value` / `onChange(value)`: "YYYY-MM-DD" string ("" when empty).
 *   Note: onChange gets the string itself, not an event.
 * - `min`: "YYYY-MM-DD", earlier days are disabled.
 * - `precision`: "day" (default) or "month". With "month" the user picks only
 *   month and year (shown as "Oct 2026"); the value is still "YYYY-MM-DD" with day 01.
 * - Everything else (error props, etc.) goes straight to <Input />.
 */
export default function DateInput({
  label,
  value = "",
  onChange,
  min,
  disabled = false,
  precision = "day",
  placeholder,
  ...rest
}) {
  const [open, setOpen] = useState(false);
  // The picker mounts on first open, and a new key resets it to `value` every time.
  const [session, setSession] = useState(0);

  const date = parseISO(value);

  function openPicker() {
    if (disabled) return;
    setSession((s) => s + 1);
    setOpen(true);
  }

  return (
    <>
      <Input
        label={label}
        icon={null}
        readOnly
        disabled={disabled}
        placeholder={
          placeholder ??
          (precision === "month" ? "Select month" : "Select date")
        }
        value={date ? formatDate(date, precision) : ""}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
          }
        }}
        {...rest}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={label}
        className="w-[22rem]"
      >
        {session > 0 && (
          <DatePicker
            key={session}
            value={date}
            minDate={parseISO(min)}
            precision={precision}
            onChange={(picked) => {
              onChange?.(toISO(picked));
              setOpen(false);
            }}
          />
        )}
      </Modal>
    </>
  );
}
