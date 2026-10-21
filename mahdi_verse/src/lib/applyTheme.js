// src/lib/applyTheme.js
import { isTheme, THEME_COOKIE } from "./theme";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Applies the theme instantly and remembers it for the next visit. */
export function applyTheme(theme) {
  if (!isTheme(theme)) return;
  const root = document.documentElement;
  const secure = window.location.protocol === "https:" ? "; secure" : "";

  if (theme === "system") {
    // Back to the device default: no attribute and no cookie
    root.removeAttribute("data-theme");
    document.cookie = `${THEME_COOKIE}=; path=/; max-age=0; samesite=lax${secure}`;
    return;
  }

  root.setAttribute("data-theme", theme);
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${ONE_YEAR}; samesite=lax${secure}`;
}
