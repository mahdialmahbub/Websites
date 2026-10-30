/**
 * ATS score engine - ONE pure function, no imports, no React, no database.
 *
 *   evaluateAts(content) -> { score, label, sections: { [sectionId]: { earned, max, percent, complete, rules, missing } } }
 *
 * The browser uses it for the live score; the server uses the very same file to save the final score on the resume,
 * so the two can never disagree. (This file exists twice - frontend/src/resume/ats/engine.js and
 * backend/src/modules/resumes/ats.engine.js - and a backend test fails when the copies differ.)
 *
 * Every rule has: id, section, points, a check (`evaluate`), a suggestion and a benefit text.
 * `evaluate` returns the points earned (a whole number from 0 to `points`) plus an optional `hint` that is added
 * to the suggestion ("It has 12 words now."). The rule points of all sections add up to exactly 100.
 * The "expected improvement" is the sum of the points the failed rules still miss, so it always matches the score.
 */

export const SECTION_ORDER = [
  'personalInformation',
  'professionalSummary',
  'workExperience',
  'education',
  'projects',
  'skills',
  'languages',
  'references',
];

export const SECTION_TITLES = {
  personalInformation: 'Personal information',
  professionalSummary: 'Professional summary',
  workExperience: 'Work experience',
  education: 'Education',
  projects: 'Projects',
  skills: 'Skills',
  languages: 'Languages',
  references: 'References',
};

// ───────────────────────── text helpers ─────────────────────────

const text = (value) => (typeof value === 'string' ? value.trim() : '');
const has = (value) => text(value) !== '';
const wordsOf = (value) => text(value).split(/\s+/).filter(Boolean);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[\d\s().-]{6,}$/;
const WEB = /^(?:https?:\/\/)?[^\s/.]+(?:\.[^\s/.]+)+(?:\/\S*)?$/i;

const ABBREVIATION_END = /(?:\be\.g|\bi\.e|\bvs|\betc|\bDr|\bMr|\bMrs|\bMs|\bProf|\bInc|\bLtd|\bSr|\bJr|\bU\.S)\.$/i;

/** Splits a description into sentences / lines, the way it will be shown as bullet points. */
export function sentencesOf(value) {
  const pieces = text(value)
    .split(/\r?\n+/)
    .flatMap((line) => line.split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/));

  // "e.g. React" / "Dr. Smith" are not the end of a sentence: glue those pieces back together.
  const merged = [];
  for (const piece of pieces) {
    if (merged.length > 0 && ABBREVIATION_END.test(merged[merged.length - 1])) merged[merged.length - 1] += ` ${piece}`;
    else merged.push(piece);
  }
  return merged.map((line) => line.replace(/^\s*(?:[-*•–—]|\d+[.)])\s+/, '').trim()).filter((line) => line.length > 1);
}

const FIRST_PERSON_I = /\bI\b/;
const FIRST_PERSON = /\b(?:me|my|mine|myself|we|our|ours|ourselves)\b/i;
export const usesFirstPerson = (value) => FIRST_PERSON_I.test(value) || FIRST_PERSON.test(value);

const BASE_VERBS = new Set(
  (
    'achieve act adapt address administer advise advocate analyze architect assemble assess assist audit authored automate boost build ' +
    'calculate champion clarify coach collaborate communicate compile complete conduct configure consolidate construct consult contribute ' +
    'control coordinate create cultivate customize debug decrease define deliver demonstrate deploy design detect determine develop devise ' +
    'direct document draft drive earn edit educate eliminate emphasize enable encourage engineer enhance ensure establish estimate evaluate ' +
    'examine exceed execute expand expedite facilitate finalize forecast formulate foster found gather generate guide handle help identify ' +
    'illustrate implement improve increase influence initiate innovate inspect install instruct integrate interview introduce investigate ' +
    'launch lead leverage maintain manage map market mentor migrate minimize model modernize monitor motivate navigate negotiate onboard ' +
    'operate optimize orchestrate organize oversee partner perform pilot plan present prioritize process produce program promote propose ' +
    'prototype provide publish raise recommend reconcile record recruit redesign reduce refactor refine release remodel render reorganize ' +
    'replace report represent research resolve restructure retain review revise revamp run safeguard save schedule secure select serve ' +
    'set simplify solve source spearhead standardize streamline strengthen submit supervise support surpass sustain synthesize teach ' +
    'test track train transform translate troubleshoot unify update upgrade validate verify visualize win write ship scale code host ' +
    'tune cut grow drive deploy migrate triage audit mentor'
  ).split(/\s+/),
);

const IRREGULAR_VERBS = { led: 'lead', built: 'build', ran: 'run', wrote: 'write', drove: 'drive', grew: 'grow', won: 'win', taught: 'teach', made: 'make', cut: 'cut', set: 'set', shipped: 'ship', spearheaded: 'spearhead' };

/** "Led", "Building", "designs", "Optimised" ... -> is it a known action verb? */
export function isActionVerb(word) {
  const w = String(word).toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return false;
  const forms = [
    w,
    IRREGULAR_VERBS[w],
    w.replace(/ied$/, 'y'),
    w.replace(/ed$/, ''),
    w.replace(/ed$/, 'e'),
    w.replace(/([a-z])\1ed$/, '$1'),
    w.replace(/ing$/, ''),
    w.replace(/ing$/, 'e'),
    w.replace(/([a-z])\1ing$/, '$1'),
    w.replace(/ies$/, 'y'),
    w.replace(/s$/, ''),
    w.replace(/ised$/, 'ize').replace(/ise$/, 'ize'),
  ];
  return forms.some((form) => form && BASE_VERBS.has(form));
}

const startsWithActionVerb = (sentence) => isActionVerb(sentence.replace(/^[^A-Za-z]+/, '').split(/\s+/)[0] ?? '');

/** A sentence "has a number" when it has digits that are not just a year ("2021"). */
const isQuantified = (sentence) => /\d/.test(sentence.replace(/\b(?:19|20)\d{2}\b/g, '')) || /%/.test(sentence);

const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value ?? '') && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));

// ───────────────────────── content helpers ─────────────────────────

const jobsOf = (c) => (c.workExperience ?? []).filter((job) => has(job.jobTitle) && has(job.companyName));
const projectsOf = (c) => (c.projects ?? []).filter((project) => has(project.projectName));
const schoolsOf = (c) => (c.education ?? []).filter((entry) => has(entry.institutionName));
const skillsOf = (c) => (c.skills ?? []).map(text).filter(Boolean);

const jobBullets = (c) => jobsOf(c).flatMap((job) => sentencesOf(job.jobDescription));
const projectBullets = (c) =>
  projectsOf(c).flatMap((project) => [...sentencesOf(project.keyResponsibilities), ...sentencesOf(project.projectDescription)]);

const ratioPoints = (points, part, total) => (total === 0 ? 0 : Math.round((points * part) / total));
const pct = (part, total) => (total === 0 ? 0 : part / total);

// ───────────────────────── the rules ─────────────────────────

/** @typedef {{ earned: number, hint?: string }} RuleResult */

export const ATS_RULES = [
  // ── personal information (20)
  {
    id: 'contact-complete',
    section: 'personalInformation',
    points: 10,
    title: 'Complete your contact details',
    suggestion: 'Recruiters and ATS software look for a name, an email, a phone number and a location first.',
    benefit: 'Recruiters can reach you and the ATS reads your contact block correctly',
    evaluate(c) {
      const p = c.personalInformation ?? {};
      const checks = [
        [3, has(p.fullName), 'your full name'],
        [3, EMAIL.test(text(p.email)), 'a valid email'],
        [2, PHONE.test(text(p.phone)), 'a phone number'],
        [2, has(p.location), 'your location'],
      ];
      const missing = checks.filter(([, ok]) => !ok).map(([, , label]) => label);
      return { earned: checks.reduce((sum, [pts, ok]) => sum + (ok ? pts : 0), 0), hint: missing.length ? `Add ${missing.join(', ')}.` : '' };
    },
  },
  {
    id: 'professional-title',
    section: 'personalInformation',
    points: 5,
    title: 'Add a professional title',
    suggestion: 'A clear title under your name (for example "Senior UI/UX Designer") tells the reader your target role at a glance.',
    benefit: 'Stronger keyword match with the job you apply for',
    evaluate: (c) => ({ earned: has(c.personalInformation?.professionalTitle) ? 5 : 0 }),
  },
  {
    id: 'online-presence',
    section: 'personalInformation',
    points: 5,
    title: 'Link your LinkedIn or website',
    suggestion: 'Add a LinkedIn profile or a personal website so employers can see more of your work.',
    benefit: 'More credibility and an easy way for recruiters to learn about you',
    evaluate(c) {
      const p = c.personalInformation ?? {};
      return { earned: [p.linkedin, p.website].some((link) => WEB.test(text(link))) ? 5 : 0 };
    },
  },

  // ── professional summary (15)
  {
    id: 'summary-length',
    section: 'professionalSummary',
    points: 8,
    title: 'Write a summary of 40 to 100 words',
    suggestion: 'A short summary of about 40 to 100 words is easy to scan and gives the ATS plenty to match.',
    benefit: 'A summary the right length gets read, and carries your key terms',
    evaluate(c) {
      const words = wordsOf(c.professionalSummary).length;
      const earned = words === 0 ? 0 : words >= 40 && words <= 100 ? 8 : (words >= 25 && words < 40) || (words > 100 && words <= 150) ? 5 : 2;
      return { earned, hint: words > 0 && earned < 8 ? `It has ${words} word${words === 1 ? '' : 's'} now.` : '' };
    },
  },
  {
    id: 'summary-no-first-person',
    section: 'professionalSummary',
    points: 3,
    title: 'Avoid "I" and "my" in the summary',
    suggestion: 'Resumes read better without first-person words. Start with your role or a strong verb instead.',
    benefit: 'A more professional, concise tone',
    evaluate(c) {
      const summary = text(c.professionalSummary);
      return { earned: summary && !usesFirstPerson(summary) ? 3 : 0 };
    },
  },
  {
    id: 'summary-keywords',
    section: 'professionalSummary',
    points: 4,
    title: 'Mention your title or key skills in the summary',
    suggestion: 'Use your job title and two or three of your main skills in the summary, the same words the job post uses.',
    benefit: 'Stronger keyword match',
    evaluate(c) {
      const summary = text(c.professionalSummary).toLowerCase();
      if (!summary) return { earned: 0 };
      const title = text(c.personalInformation?.professionalTitle).toLowerCase();
      const titleWords = title.split(/\s+/).filter((word) => word.length > 3);
      const titleHit = Boolean(title) && (summary.includes(title) || (titleWords.length > 0 && titleWords.filter((w) => summary.includes(w)).length >= Math.ceil(titleWords.length / 2)));
      const skillHits = skillsOf(c).filter((skill) => summary.includes(skill.toLowerCase())).length;
      return { earned: titleHit || skillHits >= 2 ? 4 : skillHits === 1 ? 2 : 0 };
    },
  },

  // ── work experience (25)
  {
    id: 'experience-present',
    section: 'workExperience',
    points: 8,
    title: 'Add your work experience',
    suggestion: 'List at least one job with the company and your job title. Internships and freelance work count too.',
    benefit: 'Shows the employer where you have applied your skills',
    evaluate: (c) => ({ earned: jobsOf(c).length > 0 ? 8 : 0 }),
  },
  {
    id: 'experience-descriptions',
    section: 'workExperience',
    points: 4,
    title: 'Describe each job with at least two points',
    suggestion: 'Write two to five short points for every job: what you did and what came out of it.',
    benefit: 'Gives recruiters and the ATS real content to read',
    evaluate(c) {
      const jobs = jobsOf(c);
      const described = jobs.filter((job) => sentencesOf(job.jobDescription).length >= 2).length;
      return { earned: ratioPoints(4, described, jobs.length) };
    },
  },
  {
    id: 'action-verbs',
    section: 'workExperience',
    points: 6,
    title: 'Start each point with an action verb',
    suggestion: 'Begin every point with a strong verb such as "Led", "Built", "Designed" or "Reduced".',
    benefit: 'Stronger, more confident wording',
    evaluate(c) {
      const bullets = jobBullets(c);
      if (bullets.length === 0) return { earned: 0 };
      const share = pct(bullets.filter(startsWithActionVerb).length, bullets.length);
      return { earned: share >= 0.7 ? 6 : share >= 0.4 ? 4 : share > 0 ? 2 : 0 };
    },
  },
  {
    id: 'quantified',
    section: 'workExperience',
    points: 4,
    title: 'Add numbers to your achievements',
    suggestion: 'Show the size of your results: team size, percentages, users, time or money saved. Use only numbers that are true.',
    benefit: 'Measurable proof of your impact',
    evaluate(c) {
      const count = [...jobBullets(c), ...projectBullets(c)].filter(isQuantified).length;
      return { earned: count >= 3 ? 4 : count >= 1 ? 2 : 0 };
    },
  },
  {
    id: 'consistent-dates',
    section: 'workExperience',
    points: 2,
    title: 'Give every job a start and end date',
    suggestion: 'Add a start date and an end date (or tick "Currently working here") to every job, with the end after the start.',
    benefit: 'A clear, consistent timeline that the ATS can read',
    evaluate(c) {
      const jobs = jobsOf(c);
      const ok = jobs.length > 0 && jobs.every((job) => validDate(job.startDate) && (job.currentlyWorking || validDate(job.endDate)) && (job.currentlyWorking || job.endDate >= job.startDate));
      return { earned: ok ? 2 : 0 };
    },
  },
  {
    id: 'experience-no-first-person',
    section: 'workExperience',
    points: 1,
    title: 'Remove "I" and "my" from job descriptions',
    suggestion: 'Describe your work without first-person words, for example "Led a team of 5" instead of "I led my team of 5".',
    benefit: 'A more professional tone',
    evaluate(c) {
      const bullets = jobBullets(c);
      return { earned: bullets.length > 0 && !bullets.some(usesFirstPerson) ? 1 : 0 };
    },
  },

  // ── education (10)
  {
    id: 'education-present',
    section: 'education',
    points: 7,
    title: 'Add your education',
    suggestion: 'List your school or university. Courses and certificates are fine if you have no degree.',
    benefit: 'Meets the basic education check many employers use',
    evaluate: (c) => ({ earned: schoolsOf(c).length > 0 ? 7 : 0 }),
  },
  {
    id: 'education-details',
    section: 'education',
    points: 3,
    title: 'Add the degree and the dates',
    suggestion: 'For every school add the degree or qualification and when you studied.',
    benefit: 'A complete, believable education history',
    evaluate(c) {
      const schools = schoolsOf(c);
      const complete = schools.filter((entry) => has(entry.degree) && (validDate(entry.startDate) || validDate(entry.endDate) || entry.currentlyStudying)).length;
      return { earned: ratioPoints(3, complete, schools.length) };
    },
  },

  // ── projects (10)
  {
    id: 'projects-present',
    section: 'projects',
    points: 5,
    title: 'Add a project',
    suggestion: 'Add one or two projects that show your skills in action.',
    benefit: 'Concrete proof of what you can do',
    evaluate: (c) => ({ earned: projectsOf(c).length > 0 ? 5 : 0 }),
  },
  {
    id: 'project-details',
    section: 'projects',
    points: 5,
    title: 'Describe each project and list its technologies',
    suggestion: 'For every project add a short description or your responsibilities, and the technologies or tools you used.',
    benefit: 'Stronger keyword match and a clearer story',
    evaluate(c) {
      const projects = projectsOf(c);
      const detailed = projects.filter((project) => (has(project.projectDescription) || has(project.keyResponsibilities)) && (project.technologies ?? []).length > 0).length;
      return { earned: ratioPoints(5, detailed, projects.length) };
    },
  },

  // ── skills (15)
  {
    id: 'skills-count',
    section: 'skills',
    points: 10,
    title: 'List at least 8 relevant skills',
    suggestion: 'Add the skills and tools the job asks for. Eight or more is a good target.',
    benefit: 'Stronger keyword match',
    evaluate(c) {
      const count = skillsOf(c).length;
      return { earned: count >= 8 ? 10 : count >= 5 ? 7 : count >= 3 ? 4 : count >= 1 ? 2 : 0, hint: count > 0 && count < 8 ? `You have ${count} now.` : '' };
    },
  },
  {
    id: 'skills-in-context',
    section: 'skills',
    points: 5,
    title: 'Use your skills in your summary, jobs and projects',
    suggestion: 'Mention at least three of your listed skills in your summary, job descriptions or projects, not only in the skills list.',
    benefit: 'Shows you really used the skills, and repeats the keywords the ATS looks for',
    evaluate(c) {
      const body = [c.professionalSummary, ...jobsOf(c).map((job) => job.jobDescription), ...projectsOf(c).flatMap((p) => [p.projectDescription, p.keyResponsibilities, ...(p.technologies ?? [])])]
        .map(text)
        .join(' ')
        .toLowerCase();
      const hits = skillsOf(c).filter((skill) => body.includes(skill.toLowerCase())).length;
      return { earned: hits >= 3 ? 5 : hits >= 1 ? 3 : 0 };
    },
  },

  // ── languages (3) / references (2)
  {
    id: 'languages-present',
    section: 'languages',
    points: 3,
    title: 'Add the languages you speak',
    suggestion: 'List the languages you speak and your level in each.',
    benefit: 'Useful for roles with international teams or customers',
    evaluate: (c) => ({ earned: (c.languages ?? []).some((entry) => has(entry.name)) ? 3 : 0 }),
  },
  {
    id: 'references-present',
    section: 'references',
    points: 2,
    title: 'Add a reference',
    suggestion: 'Add one or two people who can speak about your work, with their permission.',
    benefit: 'Builds trust with the employer',
    evaluate: (c) => ({ earned: (c.references ?? []).some((entry) => has(entry.name)) ? 2 : 0 }),
  },
];

// ───────────────────────── sections ─────────────────────────

/** "Completed" = the required part of the section is filled in. Only then does the section show its own score. */
const COMPLETE = {
  personalInformation: (c) => has(c.personalInformation?.fullName) && EMAIL.test(text(c.personalInformation?.email)),
  professionalSummary: (c) => has(c.professionalSummary),
  workExperience: (c) => jobsOf(c).length > 0,
  education: (c) => schoolsOf(c).length > 0,
  projects: (c) => projectsOf(c).length > 0,
  skills: (c) => skillsOf(c).length > 0,
  languages: (c) => (c.languages ?? []).some((entry) => has(entry.name)),
  references: (c) => (c.references ?? []).some((entry) => has(entry.name)),
};

/** What is still missing, shown while the section is not complete. */
const MISSING = {
  personalInformation: 'Enter your full name and a valid email to see this score.',
  professionalSummary: 'Write your summary to see this score.',
  workExperience: 'Add a job with its company and title to see this score.',
  education: 'Add your school or university to see this score.',
  projects: 'Add a project with its name to see this score.',
  skills: 'Add at least one skill to see this score.',
  languages: 'Add a language to see this score.',
  references: 'Add a reference with a name to see this score.',
};

export function bandLabel(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very good';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs work';
}

/**
 * @param {object} content the resume content (the 8 sections)
 */
export function evaluateAts(content = {}) {
  const sections = {};
  for (const id of SECTION_ORDER) {
    sections[id] = { id, title: SECTION_TITLES[id], earned: 0, max: 0, percent: 0, complete: COMPLETE[id](content), rules: [], missing: MISSING[id] };
  }

  for (const rule of ATS_RULES) {
    const result = rule.evaluate(content);
    const earned = Math.max(0, Math.min(rule.points, Math.round(result.earned)));
    const section = sections[rule.section];
    section.max += rule.points;
    section.earned += earned;
    section.rules.push({
      id: rule.id,
      title: rule.title,
      points: rule.points,
      earned,
      passed: earned === rule.points,
      suggestion: result.hint ? `${rule.suggestion} ${result.hint}` : rule.suggestion,
      benefit: rule.benefit,
    });
  }

  let score = 0;
  for (const id of SECTION_ORDER) {
    const section = sections[id];
    section.percent = Math.round((section.earned / section.max) * 100);
    score += section.earned;
  }

  return { score, label: bandLabel(score), sections };
}

/**
 * "What improves if you apply the suggestions": the points the failed rules still miss (for one section, or for all),
 * the benefits behind them, and the score you would reach. Calculated from the same rules as the score itself.
 */
export function expectedImprovement(result, sectionId) {
  const sections = sectionId ? [result.sections[sectionId]] : SECTION_ORDER.map((id) => result.sections[id]);
  const failed = sections.flatMap((section) => section.rules.filter((rule) => !rule.passed));
  const points = failed.reduce((sum, rule) => sum + (rule.points - rule.earned), 0);
  return {
    points,
    newScore: result.score + points,
    benefits: [...new Set(failed.map((rule) => rule.benefit))],
    rules: failed,
  };
}
