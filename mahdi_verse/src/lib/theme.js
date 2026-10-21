// Renamed from "theme": an old httpOnly cookie with the same name
// would stop the browser from overwriting it
export const THEME_COOKIE = "theme-pref";
export const THEMES = ["light", "dark", "system"];

export function isTheme(value) {
  return THEMES.includes(value);
}
