// ProjectCard ar ClientCard, duita-i ei same style use korbe
export const CARD_BASE =
  "border-2 transition-[border-color,background-color,box-shadow] duration-200";

// Normal state: halka bg, transparent border, halka shadow
export const CARD_DEFAULT =
  " bg-secondary-50 dark:bg-background border-secondary-500/10 hover:border-secondary-500/30";

// Selected state: full border, gaorho bg, boro glow shadow
export const CARD_SELECTED =
  "border-secondary-500/60 bg-secondary-50 dark:bg-background";

export const getCardStateClass = (isSelected) =>
  isSelected ? CARD_SELECTED : CARD_DEFAULT;
