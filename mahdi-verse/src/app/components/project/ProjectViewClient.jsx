"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Button from "../Button";

const ViewContext = createContext(null);

/**
 * Design / Development view gulo ekshathe render kore, shudhu active ta dekhay.
 * Panel gulo server e render hoy (duita-i HTML e thake, SEO er jonno bhalo),
 * ekhane shudhu show/hide hoy. View change hole details er top e scroll kore.
 *
 * @param {{
 *   views: string[],
 *   initialView: string,
 *   panels: Record<string, React.ReactNode>,
 * }} props
 */
export function ProjectViewSwitcher({ views, initialView, panels }) {
  const [active, setActive] = useState(initialView);
  const panelRefs = useRef({});
  const prevActive = useRef(initialView);

  // hidden soriye new panel dekhanor por scroll hobe.
  // prevActive check: first mount / StrictMode e scroll jate na hoy.
  useEffect(() => {
    if (prevActive.current === active) return;
    prevActive.current = active;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    panelRefs.current[active]?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [active]);

  const value = useMemo(() => ({ setActive }), []);

  return (
    <ViewContext.Provider value={value}>
      {views.map((key) => (
        <div
          key={key}
          ref={(el) => {
            panelRefs.current[key] = el;
          }}
          hidden={active !== key}
          className="scroll-mt-24"
        >
          {panels[key]}
        </div>
      ))}
    </ViewContext.Provider>
  );
}

/**
 * "Development →" / "Design →" button.
 *
 * @param {{
 *   to: string,
 *   label: string,
 *   varient?: string,
 * }} props
 */
export function ViewToggleButton({ to, label, varient }) {
  const ctx = useContext(ViewContext);
  if (!ctx) return null;

  return (
    <Button
      varient={varient}
      rightIcon
      onClick={() => ctx.setActive(to)}
      text={label}
    />
  );
}
