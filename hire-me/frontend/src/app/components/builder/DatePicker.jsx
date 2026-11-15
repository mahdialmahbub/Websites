"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "../Modal";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const clampDay = (year, month, day) => Math.min(day, daysInMonth(year, month));

const toParts = (date) => ({
  year: date.getFullYear(),
  month: date.getMonth(),
  day: date.getDate(),
});

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500";

// Selected = solid purple, today = light purple, others = white with a soft border.
const cellClass = (selected, isToday) =>
  `rounded-lg border text-sm transition-colors duration-150 ${FOCUS} ${
    selected
      ? "border-purple-600 bg-purple-600 font-semibold text-white"
      : isToday
        ? "border-purple-100 bg-purple-100 text-purple-700 enabled:hover:bg-purple-200"
        : "border-neutral-200/70 bg-white text-neutral-800 enabled:hover:bg-purple-50"
  } disabled:cursor-not-allowed disabled:opacity-35`;

/**
 * Date picker with three views: month, day and year.
 *
 * - `value`: a Date (or null). Used as the starting point.
 * - `onChange(date)`: fires when a day is picked (the final step).
 * - `minDate`: a Date (or null). Earlier days, months and years are disabled.
 * - `precision`: "day" (default) or "month". With "month" there is no day view:
 *   picking a month is the final step and the date is the 1st of that month.
 * - Year picks go on to the month view, month picks go on to the day view.
 *
 * Remount it with a new `key` to reset it to `value`.
 */
export function DatePicker({
  value = null,
  onChange,
  minYear = 2000,
  maxYear = 2100,
  minDate = null,
  precision = "day",
  hint = "Click anywhere outside to close the date picker.",
  className = "",
}) {
  const [parts, setParts] = useState(() => {
    const now = new Date();
    // With no value, open on today, or on `minDate` if that is still ahead.
    return toParts(value ?? (minDate && minDate > now ? minDate : now));
  });
  const [view, setView] = useState(precision === "month" ? "month" : "day");

  const yearListRef = useRef(null);
  const selectedYearRef = useRef(null);

  const today = new Date();

  // Anything before `minDate` is disabled.
  const min = minDate ? toParts(minDate) : null;
  const dayKey = (y, m, d) => y * 10000 + m * 100 + d;
  const minKey = min ? dayKey(min.year, min.month, min.day) : null;
  const isDayDisabled = (y, m, d) =>
    minKey !== null && dayKey(y, m, d) < minKey;
  const isMonthDisabled = (y, m) =>
    minKey !== null && dayKey(y, m, 31) < minKey;
  const isYearDisabled = (y) => min !== null && y < min.year;

  // When the year view opens, centre the selected year inside the list.
  // Done by hand (not scrollIntoView) so the modal and the page do not scroll.
  useEffect(() => {
    if (view !== "year") return;

    const list = yearListRef.current;
    const selected = selectedYearRef.current;
    if (!list || !selected) return;

    list.scrollTop =
      selected.offsetTop - list.clientHeight / 2 + selected.clientHeight / 2;
  }, [view]);

  function pickMonth(month) {
    if (precision === "month") {
      // Month + year only: picking a month is the final step, the day is always 1.
      setParts((p) => ({ ...p, month, day: 1 }));
      onChange?.(new Date(parts.year, month, 1));
      return;
    }

    setParts((p) => ({ ...p, month, day: clampDay(p.year, month, p.day) }));
    setView("day");
  }

  function pickYear(year) {
    setParts((p) => ({ ...p, year, day: clampDay(year, p.month, p.day) }));
    setView("month");
  }

  function pickDay(day) {
    setParts((p) => ({ ...p, day }));
    onChange?.(new Date(parts.year, parts.month, day));
  }

  const headerItems = [
    { id: "month", label: MONTHS[parts.month] },
    ...(precision === "month" ? [] : [{ id: "day", label: String(parts.day) }]),
    { id: "year", label: String(parts.year) },
  ];

  const years = Array.from(
    { length: Math.max(0, maxYear - minYear + 1) },
    (_, i) => minYear + i,
  );

  const isToday = (y, m, d) =>
    today.getFullYear() === y &&
    today.getMonth() === m &&
    today.getDate() === d;

  return (
    <div className={`w-full ${className}`}>
      {/* Header: shows the current pick, tap one to switch view. */}
      <div
        className={`grid gap-2 border-b border-neutral-200/70 pb-3 ${
          precision === "month" ? "grid-cols-2" : "grid-cols-[1.5fr_1fr_1fr]"
        }`}
      >
        {headerItems.map((item) => {
          const active = view === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              aria-pressed={active}
              className={`h-9 truncate rounded-lg px-2 text-sm transition-colors duration-150 ${FOCUS} ${
                active
                  ? "bg-purple-600 font-semibold text-white"
                  : "bg-purple-50 font-medium text-purple-600 hover:bg-purple-100"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div className="pt-3">
        {view === "month" && (
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((name, month) => (
              <button
                key={name}
                type="button"
                onClick={() => pickMonth(month)}
                disabled={isMonthDisabled(parts.year, month)}
                aria-pressed={parts.month === month}
                className={`h-10 truncate px-1 ${cellClass(
                  parts.month === month,
                  today.getFullYear() === parts.year &&
                    today.getMonth() === month,
                )}`}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {view === "day" && (
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from(
              { length: daysInMonth(parts.year, parts.month) },
              (_, i) => i + 1,
            ).map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => pickDay(day)}
                disabled={isDayDisabled(parts.year, parts.month, day)}
                aria-pressed={parts.day === day}
                aria-label={`${day} ${MONTHS[parts.month]} ${parts.year}`}
                className={`aspect-square ${cellClass(
                  parts.day === day,
                  isToday(parts.year, parts.month, day),
                )}`}
              >
                {day}
              </button>
            ))}
          </div>
        )}

        {view === "year" && (
          <div
            ref={yearListRef}
            className="relative max-h-[13.5rem] overflow-y-auto overscroll-contain pr-1 [scrollbar-color:#d8b4fe_transparent] [scrollbar-width:thin]"
          >
            <div className="grid grid-cols-3 gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  ref={parts.year === year ? selectedYearRef : null}
                  type="button"
                  onClick={() => pickYear(year)}
                  disabled={isYearDisabled(year)}
                  aria-pressed={parts.year === year}
                  className={`h-10 ${cellClass(
                    parts.year === year,
                    today.getFullYear() === year,
                  )}`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {hint && (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-sky-400">
          <i
            className="fi fi-rr-info text-[12px] leading-none"
            aria-hidden="true"
          />
          {hint}
        </p>
      )}
    </div>
  );
}

/**
 * Button + Modal + DatePicker, ready to use.
 *
 *   const [date, setDate] = useState(null);
 *   <DatePickerField value={date} onChange={setDate} />
 */
export default function DatePickerField({
  value = null,
  onChange,
  label = "Select date",
  placeholder = "Choose a date",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  // 0 = never opened. The picker is only rendered after the first open
  // (so "today" is never computed during server render), and the changing
  // key gives a fresh picker, reset to `value`, on every open.
  const [session, setSession] = useState(0);

  function openPicker() {
    setSession((s) => s + 1);
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={openPicker}
        className={`flex h-11 items-center justify-between gap-3 rounded-lg border border-neutral-300 bg-white px-4 text-sm transition-colors hover:border-purple-400 ${className}`}
      >
        <span className={value ? "text-neutral-900" : "text-neutral-400"}>
          {value
            ? value.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : placeholder}
        </span>
        <i className="fi fi-rr-calendar text-purple-600" aria-hidden="true" />
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={label}
        className="w-[22rem]"
      >
        {session > 0 && (
          <DatePicker
            key={session}
            value={value}
            onChange={(date) => {
              onChange?.(date);
              setOpen(false);
            }}
          />
        )}
      </Modal>
    </>
  );
}
