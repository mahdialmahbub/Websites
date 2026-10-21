"use client";

import { createContext, useContext, useState } from "react";
import Image from "next/image";
import Button from "../Button";

const ViewContext = createContext(null);

/**
 * Design / Development view gulo ekshathe render kore, shudhu active ta dekhay.
 * Panel gulo server e render hoy (duita-i HTML e thake, SEO er jonno bhalo),
 * ekhane shudhu show/hide hoy.
 *
 * @param {{
 *   views: string[],
 *   initialView: string,
 *   panels: Record<string, React.ReactNode>,
 * }} props
 */
export function ProjectViewSwitcher({ views, initialView, panels }) {
  const [active, setActive] = useState(initialView);

  return (
    <ViewContext.Provider value={{ setActive }}>
      {views.map((key) => (
        <div key={key} hidden={active !== key}>
          {panels[key]}
        </div>
      ))}
    </ViewContext.Provider>
  );
}

/**
 * Hero er top-right e thaka "Development →" / "Design →" button.
 *
 * @param {{ to: string, label: string }} props
 */
export function ViewToggleButton({ to, label }) {
  const ctx = useContext(ViewContext);
  if (!ctx) return null;

  return (
    <Button
      varient="text"
      rightIcon
      onClick={() => ctx.setActive(to)}
      text={label}
    >
    </Button>
  );
}
