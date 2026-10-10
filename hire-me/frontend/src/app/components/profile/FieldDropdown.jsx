"use client";

import React, { useId, useState } from "react";
import { ProfileIcon } from "./ProfileIcon";
import { ChipList } from "./ProfileBlocks";

/* -------------------------------------------------------------------------- */
/*  Field config                                                               */
/*                                                                             */
/*  Notun field type lagle shudhu ekhane ekta entry add korlei hobe.           */
/*                                                                             */
/*  - icon                   : ProfileIcon er naam                             */
/*  - titleKey / subtitleKey : header e kon data show hobe                     */
/*  - meta(data)             : subtitle er niche choto line (e.g. date range)  */
/*  - badge(data)            : title er pashe choto badge (e.g. "Current")     */
/*  - fields[].key           : parent er `data` object er key                  */
/*  - fields[].span          : "full" (puro width) | "half" (2 column)         */
/*  - fields[].type          : "text" | "date" | "chips" | "link" | "email"    */
/*                             | "list" (new line e bhag kore bullet banay)    */
/*  - fields[].format(data)  : custom value banate chaile (optional)           */
/* -------------------------------------------------------------------------- */

const FIELD_CONFIG = {
  "work experience": {
    icon: "building",
    fallbackTitle: "Work experience",
    titleKey: "company",
    subtitleKey: "jobTitle",
    meta: (d) => formatRange(d.startDate, d.endDate, d.isCurrent),
    badge: (d) => (d.isCurrent ? "Current" : ""),
    fields: [
      { label: "Employee type", key: "employeeType", span: "half" },
      { label: "Location", key: "location", span: "half" },
      { label: "Job description", key: "jobDescription", span: "full", type: "list" },
    ],
  },

  education: {
    icon: "graduationCap",
    fallbackTitle: "Education",
    titleKey: "institution",
    subtitleKey: "degree",
    meta: (d) => formatRange(d.startDate, d.endDate),
    fields: [
      { label: "Field of study", key: "fieldOfStudy", span: "half" },
      { label: "GPA / CGPA", key: "gpa", span: "half" },
      { label: "Description", key: "description", span: "full" },
    ],
  },

  project: {
    icon: "clipboardList",
    fallbackTitle: "Project",
    titleKey: "projectName",
    subtitleKey: "projectType",
    meta: (d) => toText(d.role),
    fields: [
      { label: "Key achievement", key: "keyAchievement", span: "full" },
      { label: "Key responsibilities", key: "keyResponsibilities", span: "full", type: "list" },
      { label: "Technologies & tools", key: "technologies", span: "full", type: "chips" },
      { label: "Project URL", key: "projectUrl", span: "full", type: "link" },
      { label: "Description", key: "description", span: "full" },
    ],
  },

  reference: {
    icon: "user",
    fallbackTitle: "Reference",
    titleKey: "name",
    subtitleKey: "designation",
    meta: (d) => toText(d.company),
    fields: [
      { label: "Relationship", key: "relationship", span: "full" },
      { label: "Email address", key: "email", span: "half", type: "email" },
      { label: "Phone number", key: "phone", span: "half" },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

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
const MONTHS_SHORT = MONTHS.map((month) => month.slice(0, 3));

// "Work Experience", "work_experience", "work-experience" -> "work experience"
const normalizeField = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, " ");

// "2023-09-02" -> "September 2, 2023" | "2023-09" -> "September 2023" | "2023" -> "2023"
// short: true hole "Sep 2023" (din bad). ISO string manually parse kora hoy,
// jate timezone er karone ek din age/pore na hoy.
const formatDate = (value, { short = false } = {}) => {
  if (!value) return "";
  const months = short ? MONTHS_SHORT : MONTHS;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return "";
    const monthName = months[value.getMonth()];
    return short
      ? `${monthName} ${value.getFullYear()}`
      : `${monthName} ${value.getDate()}, ${value.getFullYear()}`;
  }

  const str = String(value).trim();
  const match = str.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/);
  if (!match) return str; // "Present" er moto text jemon ache temon thakbe

  const [, year, month, day] = match;
  const monthName = months[Number(month) - 1];
  if (!monthName) return year;

  return day && !short
    ? `${monthName} ${Number(day)}, ${year}`
    : `${monthName} ${year}`;
};

// ("2023-09", "", true) -> "Sep 2023 – Present"
const formatRange = (start, end, isCurrent = false) => {
  const from = formatDate(start, { short: true });
  const to = isCurrent ? "Present" : formatDate(end, { short: true });
  if (!from && !to) return "";
  return `${from || "?"} – ${to || "?"}`;
};

const toText = (value) => {
  if (value == null) return "";
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return String(value).trim();
};

// Array ba "Next JS, React JS" string, duto-i list banay
const toList = (value) => {
  const list = Array.isArray(value) ? value : String(value ?? "").split(",");
  return list.map((item) => String(item).trim()).filter(Boolean);
};

// New line (\n) diye alada kora line gulo
const toLines = (value) =>
  String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const getFieldValue = (item, data) => {
  const raw = item.format ? item.format(data) : data[item.key];

  switch (item.type) {
    case "date":
      return formatDate(raw);
    case "chips":
      return toList(raw);
    case "list":
      return toLines(raw);
    default:
      return toText(raw);
  }
};

// https:// na thakle bosiye dey
const getSafeHref = (url) =>
  /^https?:\/\//i.test(url) ? url : `https://${url}`;

/* -------------------------------------------------------------------------- */
/*  Small pieces                                                               */
/* -------------------------------------------------------------------------- */

const ValueText = ({ children }) => (
  <p className="text-small sm:text-body font-medium wrap-break-word whitespace-pre-line">
    {children}
  </p>
);

// Ek line thakle normal text, ekadhik line thakle bullet list
const ListValue = ({ items }) =>
  items.length === 1 ? (
    <ValueText>{items[0]}</ValueText>
  ) : (
    <ul className="list-disc space-y-1 pl-5 marker:text-violet-500/50">
      {items.map((line, index) => (
        <li
          key={`${line}-${index}`}
          className="text-small sm:text-body font-medium wrap-break-word"
        >
          {line}
        </li>
      ))}
    </ul>
  );

const LinkValue = ({ label, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group/link inline-flex items-center gap-2 break-all text-small sm:text-body font-medium transition-colors hover:text-violet-500"
  >
    {label}
    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-violet-500/5 text-violet-500/70 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">
      <ProfileIcon name="arrowUpRight" size={12} />
    </span>
  </a>
);

const FieldItem = ({ item, data }) => {
  const value = getFieldValue(item, data);
  const isEmpty = Array.isArray(value) ? value.length === 0 : !value;

  let content;
  if (isEmpty) {
    content = <span className="text-body text-neutral-300">—</span>;
  } else if (item.type === "chips") {
    content = <ChipList items={value} />;
  } else if (item.type === "list") {
    content = <ListValue items={value} />;
  } else if (item.type === "link") {
    content = <LinkValue label={value} href={getSafeHref(value)} />;
  } else if (item.type === "email") {
    content = (
      <a
        href={`mailto:${value}`}
        className="break-all text-small sm:text-body font-medium transition-colors hover:text-violet-500"
      >
        {value}
      </a>
    );
  } else {
    content = <ValueText>{value}</ValueText>;
  }

  return (
    <div className={item.span === "half" ? "sm:col-span-1" : "sm:col-span-2"}>
      <dt className="mb-1 text-caption sm:text-small text-neutral-400">
        {item.label}
      </dt>
      <dd>{content}</dd>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Main component                                                             */
/*                                                                             */
/*  <FieldDropdown field="education" data={{ institution: "...", ... }} />     */
/* -------------------------------------------------------------------------- */

/**
 * @typedef {"work experience" | "education" | "project" | "reference"} FieldType
 *
 * @typedef {Object} FieldDropdownProps
 * @property {FieldType} [field="work experience"] - Kon section er card (config select kore)
 * @property {Record<string, any>} data - Oi item er data (id, company, jobTitle ...)
 * @property {boolean} [defaultOpen=false] - Shuru te expanded thakbe kina
 * @property {string} [className] - Extra Tailwind classes
 */

/** @param {FieldDropdownProps} props */
const FieldDropdown = ({
  field = "work experience",
  data,
  defaultOpen = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  const config = FIELD_CONFIG[normalizeField(field)];

  if (!config) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[FieldDropdown] Unknown field "${field}". Use one of: ${Object.keys(FIELD_CONFIG).join(", ")}`,
      );
    }
    return null;
  }

  const info = data ?? {};
  const title = toText(info[config.titleKey]) || config.fallbackTitle;
  const subtitle = toText(info[config.subtitleKey]);
  const meta = config.meta?.(info) ?? "";
  const badge = config.badge?.(info) ?? "";

  return (
    <div
      className={`rounded-xl border bg-white transition-colors duration-200 ${
        isOpen
          ? "border-violet-500/25"
          : "border-neutral-500/10 hover:border-violet-500/25"
      } ${className}`}
    >
      {/* header — puro row ta click korle open/close hobe */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="flex w-full items-center gap-3 rounded-xl p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 sm:p-4"
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-violet-500/5 text-[22px] text-violet-500/80 max-sm:hidden">
          <ProfileIcon name={config.icon} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-primary text-[16px] font-medium wrap-break-word sm:text-[18px]">
              {title}
            </span>
            {badge && (
              <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-caption font-medium leading-none text-green-600">
                {badge}
              </span>
            )}
          </span>
          {subtitle && (
            <span className="mt-0.5 block text-small sm:text-body text-neutral-600 wrap-break-word">
              {subtitle}
            </span>
          )}
          {meta && (
            <span className="mt-0.5 block text-caption sm:text-small text-neutral-400">
              {meta}
            </span>
          )}
        </span>

        <span
          className={`grid size-8 shrink-0 place-items-center rounded-lg bg-primary-200/5 text-[18px] text-primary-200 transition-transform duration-300 motion-reduce:transition-none ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <ProfileIcon name="chevronDown" />
        </span>
      </button>

      {/* content — smooth collapse. `invisible` thakle link gulo keyboard focus pay na */}
      <div
        id={contentId}
        className={`grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-in-out motion-reduce:transition-none ${
          isOpen
            ? "visible grid-rows-[1fr] opacity-100"
            : "invisible grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-5 border-t border-neutral-500/10 p-3 pt-4 sm:grid-cols-2 sm:p-4 sm:pt-5">
            {config.fields.map((item) => (
              <FieldItem key={item.label} item={item} data={info} />
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FieldDropdown;
