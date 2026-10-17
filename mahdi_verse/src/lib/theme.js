export const THEME_COOKIE = "theme";
export const THEMES = ["light", "dark", "system"];

export function isTheme(value) {
  return THEMES.includes(value);
}