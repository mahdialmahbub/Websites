/**
 * Title-based template recommendations.
 *
 * Pure functions, no dependencies, safe on the server and in the browser.
 *
 * How it works:
 *  1. The typed title is normalized (case, punctuation, accents, common abbreviations).
 *  2. The title is matched against ROLE_FAMILIES (keyword table below). Each matching family gets a
 *     strength between 0 and ~1.3 (exact word > plural/suffix variant > half-typed word).
 *  3. Every template gets a score: the family strength times how well the template's own metadata
 *     (category, name, subtitle, description and, when the API provides them, roles / keywords / tags)
 *     contains the family's `terms`, plus a small bonus when a title word appears in the template metadata.
 *  4. Templates above the cut-off are "recommended" and sorted by score. All other templates keep
 *     their original order after them, so nothing becomes unreachable.
 *
 * To extend: add a family to ROLE_FAMILIES, or add `roles` / `keywords` / `tags` to the template data
 * (arrays or comma separated strings). No UI change is needed.
 */

const MIN_SCORE = 2; // below this a template is never recommended
const RELATIVE_CUTOFF = 0.5; // ...and it must reach this share of the best score
const MAX_RECOMMENDED = 5;
const DIRECT_STRONG = 4; // title word found in category / tags / roles
const DIRECT_WEAK = 1.5; // title word found in name / description

const STOP_WORDS = new Set(["a", "an", "and", "at", "for", "in", "of", "the", "to", "with", "as", "on", "i", "am", "resume", "cv", "job", "role", "position"]);

// Words found in a lot of unrelated titles. They never count as a direct match on their own.
const GENERIC_WORDS = new Set([
  "senior", "junior", "lead", "head", "chief", "principal", "staff", "associate", "assistant", "intern", "trainee",
  "manager", "specialist", "executive", "officer", "coordinator", "consultant", "professional", "expert", "general",
  "team", "new", "my", "ii", "iii",
]);

const TOKEN_ALIASES = {
  sr: "senior", jr: "junior", dev: "developer", devs: "developer", eng: "engineer", engr: "engineer",
  mgr: "manager", swe: "software engineer", sde: "software engineer", ux: "ux", frontend: "frontend",
};

const PHRASE_ALIASES = [
  ["front end", "frontend"],
  ["back end", "backend"],
  ["full stack", "fullstack"],
  ["dev ops", "devops"],
  ["e commerce", "ecommerce"],
];

// `keywords`: strong signals in the title. `weak`: generic words that only count half.
// `terms`: words to look for in template metadata, with their weight (style words and role words).
const ROLE_FAMILIES = [
  {
    id: "software",
    keywords: ["software", "programmer", "coder", "fullstack", "backend", "devops", "sre", "cloud", "mobile developer", "android", "ios", "qa", "tester", "cybersecurity", "security engineer", "sysadmin", "network engineer", "blockchain", "embedded", "game developer"],
    weak: ["developer", "engineer", "technical", "it", "tech"],
    terms: { software: 3, developer: 3, tech: 3, technical: 3, engineer: 2, ats: 3, minimal: 2, clean: 1.5, professional: 1.5, modern: 1 },
  },
  {
    id: "frontend",
    keywords: ["frontend", "react", "vue", "angular", "javascript", "typescript", "css", "html", "nextjs", "web", "web designer", "ui developer", "webflow", "wordpress"],
    weak: ["developer"],
    terms: { frontend: 3, web: 3, developer: 2, ui: 2.5, modern: 3, creative: 1.5, minimal: 1.5, ats: 2, tech: 2, technical: 1.5 },
  },
  {
    id: "ux-design",
    keywords: ["ui", "ux", "product designer", "user experience", "user interface", "interaction designer", "figma", "ux researcher", "design systems"],
    weak: ["designer", "design"],
    terms: { design: 3, designer: 3, creative: 3, modern: 3, portfolio: 2, ui: 2, ux: 2, minimal: 1.5, bold: 1 },
  },
  {
    id: "graphic",
    keywords: ["graphic", "illustrator", "art director", "animator", "photographer", "videographer", "video editor", "branding", "creative director", "fashion", "artist", "motion", "visual designer"],
    weak: ["designer", "design", "creative", "video"],
    terms: { creative: 3, design: 3, designer: 3, portfolio: 3, modern: 2.5, bold: 2, colorful: 2, artistic: 2, minimal: 1 },
  },
  {
    id: "management",
    keywords: ["project manager", "program manager", "product manager", "product owner", "scrum", "agile", "pm", "director", "team lead", "leadership", "general manager", "supervisor", "operations manager", "business manager", "vp", "vice president", "ceo", "cto", "cfo", "coo"],
    weak: ["manager", "management", "lead", "project", "program", "head"],
    terms: { management: 3, manager: 2.5, leadership: 3, executive: 3, professional: 3, business: 2, classic: 2, modern: 2, ats: 1.5, minimal: 1 },
  },
  {
    id: "marketing",
    keywords: ["marketing", "seo", "sem", "social media", "digital marketing", "content marketing", "advertising", "growth", "public relations", "pr", "community manager", "brand manager", "ecommerce"],
    weak: ["brand", "media", "content"],
    terms: { marketing: 3, creative: 2.5, modern: 3, business: 2, professional: 1.5, bold: 1.5 },
  },
  {
    id: "data",
    keywords: ["data", "analytics", "business intelligence", "bi", "statistician", "machine learning", "ml", "ai", "sql", "data scientist", "data engineer", "quantitative"],
    weak: ["analyst", "research", "statistics"],
    terms: { data: 3, analyst: 3, analytical: 3, technical: 2, ats: 3, minimal: 2.5, professional: 2, clean: 1.5, modern: 1 },
  },
  {
    id: "student",
    keywords: ["student", "graduate", "fresher", "internship", "entry level", "undergraduate", "recent graduate", "apprentice", "high school", "college", "university"],
    weak: ["intern", "trainee", "junior"],
    terms: { student: 3, graduate: 3, entry: 3, internship: 3, fresher: 3, simple: 2.5, minimal: 3, clean: 2, ats: 2, modern: 1 },
  },
  {
    id: "sales",
    keywords: ["sales", "account executive", "business development", "bdr", "sdr", "account manager", "customer success", "real estate", "realtor", "retail"],
    weak: ["business", "account"],
    terms: { sales: 3, business: 2, professional: 3, modern: 2, ats: 2, executive: 2, bold: 1 },
  },
  {
    id: "finance",
    keywords: ["finance", "financial", "accountant", "accounting", "auditor", "bookkeeper", "banker", "banking", "investment", "tax", "treasury", "actuary", "cpa"],
    weak: ["analyst"],
    terms: { finance: 3, professional: 3, classic: 3, ats: 3, minimal: 1.5, executive: 2, conservative: 2 },
  },
  {
    id: "healthcare",
    keywords: ["nurse", "nursing", "doctor", "physician", "medical", "clinical", "pharmacist", "dentist", "therapist", "healthcare", "caregiver", "paramedic", "surgeon", "lab technician"],
    weak: ["health", "care"],
    terms: { healthcare: 3, medical: 3, professional: 3, classic: 2, ats: 3, clean: 2, minimal: 1.5 },
  },
  {
    id: "education",
    keywords: ["teacher", "teaching", "professor", "lecturer", "tutor", "instructor", "educator", "academic", "researcher", "scientist", "phd", "librarian", "school"],
    weak: ["research", "education"],
    terms: { education: 3, academic: 3, professional: 2, classic: 3, ats: 2.5, minimal: 2 },
  },
  {
    id: "engineering",
    keywords: ["mechanical", "civil", "electrical", "chemical", "construction", "manufacturing", "technician", "surveyor", "industrial", "structural", "aerospace", "petroleum", "architect", "mechatronics", "electronics"],
    weak: ["engineer", "engineering"],
    terms: { engineer: 3, engineering: 3, technical: 3, professional: 3, ats: 3, classic: 2, minimal: 2 },
  },
  {
    id: "hr",
    keywords: ["hr", "human resources", "recruiter", "recruitment", "talent acquisition", "people operations"],
    weak: ["people", "talent"],
    terms: { professional: 3, business: 2, modern: 2, classic: 2, ats: 2 },
  },
  {
    id: "support",
    keywords: ["customer service", "customer support", "support specialist", "call center", "receptionist", "help desk", "helpdesk", "customer care", "service desk"],
    weak: ["support", "service"],
    terms: { professional: 2, simple: 2.5, clean: 2.5, ats: 3, minimal: 2 },
  },
  {
    id: "writing",
    keywords: ["writer", "copywriter", "editor", "journalist", "author", "blogger", "content creator", "technical writer", "translator"],
    weak: ["content", "writing"],
    terms: { creative: 3, writer: 3, editor: 2, portfolio: 2, modern: 2, minimal: 2, classic: 1 },
  },
  {
    id: "legal",
    keywords: ["lawyer", "attorney", "paralegal", "legal", "counsel", "law"],
    weak: ["compliance"],
    terms: { classic: 3, professional: 3, conservative: 2.5, ats: 2, executive: 2, minimal: 1 },
  },
  {
    id: "admin",
    keywords: ["admin", "administrative", "administrator", "office manager", "secretary", "executive assistant", "personal assistant", "operations", "logistics", "supply chain", "warehouse", "procurement", "clerk"],
    weak: ["office"],
    terms: { professional: 2.5, simple: 2.5, clean: 2, ats: 3, minimal: 2 },
  },
  {
    id: "hospitality",
    keywords: ["chef", "cook", "waiter", "waitress", "hotel", "front desk", "bartender", "barista", "hospitality", "event planner", "travel agent", "flight attendant"],
    weak: ["event"],
    terms: { simple: 3, clean: 2.5, modern: 2, ats: 2, minimal: 2 },
  },
];

/* ---------- normalization ---------- */

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Lowercase, strip accents and punctuation, expand common abbreviations. Returns "" for empty input. */
export function normalizeTitle(value) {
  const base = String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  if (!base) return "";

  let out = base
    .split(" ")
    .map((word) => TOKEN_ALIASES[word] ?? word)
    .join(" ");
  for (const [from, to] of PHRASE_ALIASES) {
    out = out.replace(new RegExp(`\\b${escapeRegExp(from)}\\b`, "g"), to);
  }
  return out;
}

const hasWord = (haystack, needle) => ` ${haystack} `.includes(` ${needle} `);
const tokensOf = (normalized) => normalized.split(" ").filter((token) => token && !STOP_WORDS.has(token));

const toList = (value) => {
  if (Array.isArray(value)) return value.filter((item) => typeof item === "string");
  if (typeof value === "string") return value.split(/[,;]/);
  return [];
};

/* ---------- title -> role families ---------- */

// How well one keyword matches the typed words (0 when it does not).
function keywordStrength(keyword, tokens, joined) {
  if (keyword.includes(" ")) return hasWord(joined, keyword) ? 1 : 0;

  let best = 0;
  tokens.forEach((token, position) => {
    if (token === keyword) best = Math.max(best, 1);
    // plural / suffix variants: "designers", "developers", "engineering"
    else if (keyword.length >= 4 && token.startsWith(keyword) && token.length - keyword.length <= 3) best = Math.max(best, 0.8);
    // the last word is still being typed: "softw" -> "software"
    else if (position === tokens.length - 1 && token.length >= 3 && keyword.length > token.length && keyword.startsWith(token)) best = Math.max(best, 0.7);
  });
  return best;
}

function matchFamilies(tokens, joined) {
  const matches = [];
  for (const family of ROLE_FAMILIES) {
    const strong = family.keywords.map((keyword) => keywordStrength(keyword, tokens, joined)).filter(Boolean);
    const weak = family.weak.map((keyword) => keywordStrength(keyword, tokens, joined) * 0.5).filter(Boolean);
    const all = [...strong, ...weak].sort((a, b) => b - a);
    if (all.length === 0) continue;
    // best match plus a small bonus for every extra keyword that also matched
    const strength = Math.min(1.3, all[0] + Math.min(0.3, (all.length - 1) * 0.1));
    matches.push({ family, strength });
  }
  return matches;
}

/* ---------- template scoring ---------- */

function templateFields(template) {
  const strong = [
    ...toList(template.roles),
    ...toList(template.keywords),
    ...toList(template.tags),
    template.category?.slug,
    template.category?.name,
  ]
    .filter(Boolean)
    .map(normalizeTitle);
  const text = normalizeTitle([template.name, template.subtitle, template.description].filter(Boolean).join(" "));
  return { strong, text };
}

const termHit = (fields, term) => {
  if (fields.strong.some((entry) => hasWord(entry, term))) return 1;
  return hasWord(fields.text, term) ? 0.5 : 0;
};

function scoreTemplate(template, familyMatches, directWords) {
  const fields = templateFields(template);
  let score = 0;

  for (const { family, strength } of familyMatches) {
    let familyScore = 0;
    for (const [term, weight] of Object.entries(family.terms)) familyScore += weight * termHit(fields, term);
    score += familyScore * strength;
  }

  // a title word that the template metadata itself mentions (works for roles no family knows about)
  for (const word of directWords) {
    if (fields.strong.some((entry) => hasWord(entry, word))) score += DIRECT_STRONG;
    else if (hasWord(fields.text, word)) score += DIRECT_WEAK;
  }
  return score;
}

/**
 * @param {string} title      what the user typed
 * @param {Array}  templates  objects with at least `slug` (+ optional category, name, subtitle, description, roles, keywords, tags)
 * @returns {{ query: string, ordered: Array, recommendedSlugs: string[], topSlug: string|null, hasMatch: boolean }}
 *   `ordered` always contains every template: recommended ones first (best first), the rest in their original order.
 */
export function recommendTemplates(title, templates = []) {
  const list = Array.isArray(templates) ? templates : [];
  const query = normalizeTitle(title);
  const fallback = { query, ordered: list, recommendedSlugs: [], topSlug: null, hasMatch: false };

  if (!query || list.length < 2) return fallback;
  const tokens = tokensOf(query);
  if (tokens.length === 0) return fallback;

  const familyMatches = matchFamilies(tokens, query);
  const directWords = tokens.filter((token) => token.length >= 3 && !GENERIC_WORDS.has(token));
  if (familyMatches.length === 0 && directWords.length === 0) return fallback;

  const scored = list.map((template, index) => ({ template, index, score: scoreTemplate(template, familyMatches, directWords) }));
  const best = Math.max(...scored.map((item) => item.score));
  if (best < MIN_SCORE) return fallback;

  const cutoff = Math.max(MIN_SCORE, best * RELATIVE_CUTOFF);
  const picked = scored
    .filter((item) => item.score >= cutoff)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, MAX_RECOMMENDED);

  // if everything qualifies, the metadata cannot tell the templates apart: do not pretend otherwise
  if (picked.length === list.length) return fallback;

  const pickedSet = new Set(picked.map((item) => item.template));
  const ordered = [...picked.map((item) => item.template), ...list.filter((template) => !pickedSet.has(template))];
  const recommendedSlugs = picked.map((item) => item.template.slug);

  return { query, ordered, recommendedSlugs, topSlug: recommendedSlugs[0] ?? null, hasMatch: true };
}
