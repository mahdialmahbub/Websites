"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";

/**
 * Device gulor width (parent er percentage). Ekhane bodlalei size bodle jabe.
 * Height kokhono fix na, image er nijer ratio onujayi hoy.
 */
const DEVICES = [
  {
    key: "desktop",
    label: "Desktop",
    icon: "fi fi-rr-screen",
    width: "100%",
    sizes: "(min-width: 1280px) 1100px, 100vw",
  },
  {
    key: "tablet",
    label: "Tablet",
    icon: "fi fi-rr-tablet-android",
    width: "60%",
    sizes: "(min-width: 1280px) 660px, 60vw",
  },
  {
    key: "mobile",
    label: "Mobile",
    icon: "fi fi-rr-mobile-button",
    width: "34%",
    sizes: "(min-width: 1280px) 380px, 34vw",
  },
];

/** Light/Dark toggle (DarkToggleBTN er style, icon-only) */
const MODES = [
  { key: "light", label: "Light", icon: "fi fi-rr-brightness" },
  { key: "dark", label: "Dark", icon: "fi fi-rr-moon-stars" },
];

const pad = (n) => String(n).padStart(2, "0");

/** { light, dark } object kina. Static import object-e `src` thake, tai alada chena jay */
const hasVariants = (input) =>
  Boolean(input) &&
  typeof input === "object" &&
  ("light" in input || "dark" in input);

/**
 * Mode onujayi image bachhe dey.
 * - Plain image: duita mode-e ekoi image
 * - { light, dark }: mode onujayi. Oi mode er image na thakle onnota dekhay, isFallback = true
 */
function pickVariant(input, mode) {
  if (!input) return { image: null, isFallback: false };
  if (!hasVariants(input)) return { image: input, isFallback: false };

  if (input[mode]) return { image: input[mode], isFallback: false };

  const other = mode === "dark" ? input.light : input.dark;
  return { image: other ?? null, isFallback: Boolean(other) };
}

/** Static import ba { src: staticImport, alt } dui-i niye shothik { src, alt } dey */
function normalizeImage(input, fallbackAlt) {
  if (!input) return null;
  if (typeof input === "object" && input.src && typeof input.src === "object") {
    return { src: input.src, alt: input.alt || fallbackAlt };
  }
  return { src: input, alt: fallbackAlt };
}

const activeBtn =
  "border-cyan-300 bg-cyan-50 text-cyan-700 shadow-[0_5px_15px_rgba(6,182,212,0.12)] dark:border-cyan-400/20 dark:bg-cyan-400/8 dark:text-cyan-400 dark:shadow-none";
const idleBtn =
  "border-transparent text-slate-600 hover:bg-cyan-50/60 hover:text-cyan-700 dark:text-slate-300 dark:hover:bg-white/5";

/* ------------------------------------------------------------------ */
/* Light / Dark toggle                                                 */
/* ------------------------------------------------------------------ */

/** @param {{ mode: "light" | "dark", onChange: (mode: string) => void }} props */
function ModeToggle({ mode, onChange }) {
  return (
    <div
      role="group"
      aria-label="Preview color mode"
      className="flex gap-1 rounded-xl bg-white/60 p-1 dark:bg-white/2.5"
    >
      {MODES.map(({ key, label, icon }) => (
        <button
          key={key}
          type="button"
          aria-pressed={mode === key}
          onClick={() => onChange(key)}
          className={`flex items-center gap-1.5 rounded-lg border px-space-3 py-1.5 text-size-sm font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-cyan-400 ${
            mode === key ? activeBtn : idleBtn
          }`}
        >
          <i aria-hidden="true" className={`${icon} flex text-[13px]`} />
          {label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page tabs + mode toggle + counter (shudhu upore)                    */
/* ------------------------------------------------------------------ */

function PageToolbar({
  pages,
  current,
  title,
  onSelect,
  onKeyDown,
  tabIdPrefix,
  panelId,
  hasModes,
  mode,
  onModeChange,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-space-4">
      {pages.length > 1 ? (
        <div
          role="tablist"
          aria-label={`${title} pages`}
          onKeyDown={onKeyDown}
          className="flex max-w-full gap-space-2 overflow-x-auto rounded-xl bg-white/60 p-space-2 dark:bg-white/2.5"
        >
          {pages.map((p, index) => {
            const isActive = index === current;
            const available = DEVICES.filter((d) => p[d.key]);

            return (
              <button
                key={p.name}
                type="button"
                role="tab"
                id={`${tabIdPrefix}-${index}`}
                aria-selected={isActive}
                aria-controls={panelId}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onSelect(index)}
                className={`flex shrink-0 items-center gap-space-2 rounded-lg border px-space-3 py-space-2 text-size-sm font-medium transition-all duration-300 focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                  isActive ? activeBtn : idleBtn
                }`}
              >
                <span className="font-mono text-size-xs_2 opacity-60">
                  {pad(index + 1)}
                </span>
                {p.name}

                {/* Ei page e kon kon device er image ache */}
                <span
                  role="img"
                  aria-label={`Available on ${available
                    .map((d) => d.label)
                    .join(", ")}`}
                  className="flex gap-1 opacity-60"
                >
                  {available.map((d) => (
                    <i
                      key={d.key}
                      aria-hidden="true"
                      title={d.label}
                      className={`${d.icon} flex text-[12px]`}
                    />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-space-4">
        {hasModes && <ModeToggle mode={mode} onChange={onModeChange} />}
        <p className="font-mono text-size-xs_2 font-medium tracking-[0.03em] text-cyan-700 dark:text-cyan-400/80">
          Page {current + 1} / {pages.length}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Next page button (niche)                                            */
/* ------------------------------------------------------------------ */

/** @param {{ next: { name: string }, onClick: () => void }} props */
function NextPageButton({ next, onClick }) {
  return (
    <div className="flex justify-end border-t border-cyan-100 pt-space-5 dark:border-white/8">
      <button
        type="button"
        onClick={onClick}
        aria-label={`Go to next page: ${next.name}`}
        className="group/next inline-flex items-center gap-2.5 rounded-full font-primary text-size-sm font-semibold text-slate-800 transition-all duration-300 hover:gap-3.5 focus-visible:outline-2 focus-visible:outline-cyan-400 dark:text-foreground"
      >
        <span className="flex flex-col items-end text-right">
          <span>{next.name}</span>
        </span>

        <span className="flex size-9 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 text-cyan-700 transition-all duration-300 group-hover/next:border-cyan-300 group-hover/next:bg-cyan-100 group-hover/next:shadow-[0_5px_15px_rgba(6,182,212,0.12)] dark:border-white/10 dark:bg-white/[0.035] dark:text-cyan-400 dark:group-hover/next:border-cyan-400/20 dark:group-hover/next:bg-cyan-400/8 dark:group-hover/next:shadow-none">
          <i
            aria-hidden="true"
            className="fi fi-rr-arrow-small-right flex text-[16px] transition-transform duration-300 group-hover/next:translate-x-0.5"
          />
        </span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Device frame                                                        */
/* ------------------------------------------------------------------ */

/** @param {{ device: typeof DEVICES[number], image: any, pageName: string, pageNumber: number, alt: string, note?: string | null }} props */
function DeviceFrame({ device, image, pageName, pageNumber, alt, note }) {
  const img = normalizeImage(image, alt);
  if (!img) return null;

  return (
    <figure
      className="min-w-0 overflow-hidden rounded-2xl border border-cyan-100 bg-white/60 shadow-[0_6px_18px_rgba(6,182,212,0.08)] dark:border-white/8 dark:bg-white/2.5 dark:shadow-none"
      style={{ width: device.width }}
    >
      {/* Indicator: konta kon device, konta kon page */}
      <figcaption className="flex items-center justify-between gap-space-2 border-b border-cyan-100 px-space-3 py-space-2 dark:border-white/8">
        <span className="flex min-w-0 items-center gap-1.5 text-cyan-700 dark:text-cyan-400">
          {device.key === "desktop" && (
            <span className="mr-1 flex gap-1" aria-hidden="true">
              <span className="block size-2 rounded-full bg-red-400" />
              <span className="block size-2 rounded-full bg-amber-400" />
              <span className="block size-2 rounded-full bg-emerald-400" />
            </span>
          )}
          <i aria-hidden="true" className={`${device.icon} flex text-[13px]`} />
          <span className="font-mono text-size-xs_2 font-medium tracking-[0.03em]">
            {device.label}
          </span>
        </span>

        <span className="flex min-w-0 items-center gap-space-2">
          {/* Oi mode er image na thakle bole dey kon mode er image dekhano hocche */}
          {note && (
            <span className="shrink-0 rounded-full bg-cyan-50 px-2 py-0.5 text-size-xs_2 font-medium text-cyan-700 dark:bg-cyan-400/8 dark:text-cyan-400">
              {note}
            </span>
          )}
          <span className="min-w-0 truncate text-size-xs_2 text-placeholder_2 dark:text-placeholder/80">
            Page {pad(pageNumber)} · {pageName}
          </span>
        </span>
      </figcaption>

      {/* static import hole width/height nijei ashe, tai h-auto dile ratio thik thake */}
      <Image
        src={img.src}
        alt={img.alt}
        sizes={device.sizes}
        className="block h-auto w-full"
      />
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Main viewer                                                         */
/* ------------------------------------------------------------------ */

/**
 * @param {{
 *   pages: {
 *     name: string,
 *     desktop?: any,   // static import ba { light, dark }
 *     tablet?: any,
 *     mobile?: any,
 *   }[],
 *   title?: string,
 * }} props
 */
export default function PagePreviewViewer({ pages = [], title = "Project" }) {
  // Hook gulo shob shomoy early return er age thakte hobe
  const uid = useId();
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState("light");

  const rootRef = useRef(null);
  const shouldScroll = useRef(false);

  // Next button theke page bodlale component er top e scroll kore.
  // Tab click e scroll hoy na, karon tab bar to already top e.
  useEffect(() => {
    if (!shouldScroll.current) return;
    shouldScroll.current = false;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    rootRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [active]);

  const validPages = pages.filter((p) => p?.desktop || p?.tablet || p?.mobile);
  if (!validPages.length) return null;

  // Kono ekta image-e light + dark dui-i thakle toggle dekhabe
  const hasModes = validPages.some((p) =>
    DEVICES.some(
      (d) => hasVariants(p[d.key]) && p[d.key].light && p[d.key].dark,
    ),
  );

  const last = validPages.length - 1;
  const current = Math.min(active, last);
  const page = validPages[current];

  const nextPage = validPages[current + 1]; // last page e undefined

  const goNext = () => {
    if (!nextPage) return;
    shouldScroll.current = true;
    setActive(current + 1);
  };

  const shots = DEVICES.filter((d) => page[d.key]);
  const desktop = shots.find((d) => d.key === "desktop");
  const secondary = shots.filter((d) => d.key !== "desktop");

  const onKeyDown = (e) => {
    const next = {
      ArrowRight: current === last ? 0 : current + 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    }[e.key];

    if (next === undefined) return;
    e.preventDefault();
    setActive(next);
    e.currentTarget.querySelectorAll('[role="tab"]')[next]?.focus();
  };

  const frameProps = (device) => {
    const { image, isFallback } = pickVariant(page[device.key], mode);

    return {
      device,
      image,
      pageName: page.name,
      pageNumber: current + 1,
      alt: `${title} ${page.name} page, ${device.label.toLowerCase()} view${
        hasModes ? `, ${mode} mode` : ""
      }`,
      note: isFallback ? `${mode === "dark" ? "Light" : "Dark"} only` : null,
    };
  };

  const panelId = `${uid}-panel`;

  return (
    <div
      ref={rootRef}
      className="relative scroll-mt-24 overflow-hidden rounded-3xl border border-[#D6EEF0] bg-secondary-50/50 dark:border-white/[0.07] dark:bg-[#0B1117]"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-cyan-300/12 blur-3xl dark:bg-cyan-400/[0.07]"
      />

      <div className="relative z-10 space-y-space-6 p-5 sm:p-8">
        {/* ---------- Top toolbar ---------- */}
        <PageToolbar
          pages={validPages}
          current={current}
          title={title}
          onSelect={setActive}
          onKeyDown={onKeyDown}
          tabIdPrefix={`${uid}-tab`}
          panelId={panelId}
          hasModes={hasModes}
          mode={mode}
          onModeChange={setMode}
        />

        {/* ---------- Panel ---------- */}
        <div
          role="tabpanel"
          id={panelId}
          aria-labelledby={`${uid}-tab-${current}`}
          className="mx-auto w-[70%]"
        >
          {/* key bodlale page switch e panel abar mount hoy */}
          <div key={current} className="space-y-space-6">
            {desktop && <DeviceFrame {...frameProps(desktop)} />}

            {secondary.length > 0 && (
              <div
                className={`flex items-start gap-space-4 ${
                  secondary.length > 1 ? "justify-between" : "justify-center"
                }`}
              >
                {secondary.map((device) => (
                  <DeviceFrame key={device.key} {...frameProps(device)} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ---------- Next page button (last page e dekhabe na) ---------- */}
        {nextPage && <NextPageButton next={nextPage} onClick={goNext} />}
      </div>
    </div>
  );
}
