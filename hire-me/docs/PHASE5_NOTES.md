# Phase 5 - ATS score and suggestions

Copy `backend/` and `frontend/` files over the project (same paths). No new packages. Restart the backend.

## What you get
- **Live overall score (0-100)** in the circle (colour by band: Needs work / Fair / Good / Very good / Excellent) that follows every keystroke.
- **Section score**: a step shows its own score (`12/20`) once its required fields are filled in
  (name + valid email, a summary, a job with company and title, a school, a project name, a skill, a language, a reference).
  Until then the panel says what is missing. A small line under every step title shows the overall score and the step score too
  (useful on phones, where the panel is behind the "ATS Score" button).
- **Suggestions for the step you are on**: each says what to do and how many points it is worth ("+4"). Clicking a row of the
  Score Breakdown shows the suggestions of that section.
- **Green "Expected improvement" box** under the suggestions: "+9 ATS score, from 11 to 20" and the benefits (for example
  "Stronger keyword match"). The numbers come from the same rules as the score.
- **Saved on the resume**: the server calculates the score with the same engine file when the resume is created, after content changes and at Generate.
- **Optional AI keyword ideas** in the Skills step ("Get keyword ideas"): suggestions for the job title; click one to add it as a skill.

## The rules (20 rules = 100 points)
personal: contact details 10, professional title 5, LinkedIn/website 5 - summary: length 40-100 words 8, no "I/my" 3, title/skills mentioned 4 -
experience: has a job 8, descriptions 4, starts with action verbs 6, numbers in achievements 4, consistent dates 2, no "I/my" 1 -
education: present 7, degree + dates 3 - projects: present 5, description + technologies 5 - skills: 8+ skills 10, used in context 5 -
languages 3 - references 2. To change a rule or its points edit `ATS_RULES` in the engine (and copy the file to the other side).

## Checked
Frontend: 17 engine tests (points add to 100, a complete resume = 100, every rule's tiers, "expected improvement" always reaches exactly 100
when everything is fixed), 5 UI scenarios in jsdom (empty draft, completing a section, live updates, optimized section, breakdown click,
keyword ideas + error), lint clean, `next build` passes.
Backend: 38 tests including the "both engine copies are identical" check, 4 keyword tests.
NOT checked: saving the score against a live MongoDB.

## Manual test
1. `/builder`, press "ATS Score": 0 and "Enter your full name ...". Fill name + email -> "Section score 6/20", suggestions, green box "+14".
2. Add a title -> 11/20 and "+9" at once. Write a 60-word summary without "I" -> summary section 15/15.
3. Skills step: type a job title first, press "Get keyword ideas", click a chip -> it joins your skills.
4. Reload the page after Generate (next phase) or open DevTools > Network on an autosave: the answer contains `atsScore`.
