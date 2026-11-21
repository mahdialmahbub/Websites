import { glue, section } from '../../engine/blockKit';
import { dateRange, joinNonEmpty, prettyUrl, safeHref } from '../../lib/format';
import { textToBullets } from '../../lib/textToBullets';

/*
 * PLAYFUL: contact details, photo and name live in the page header (Page.jsx, first page only).
 * main    -> Profile, Work Experience, Projects, References
 * sidebar -> Skills, Education, Languages
 */

const has = (value) => (Array.isArray(value) ? value.length > 0 : String(value ?? '').trim() !== '');
const hasAny = (item, keys) => keys.some((key) => has(item?.[key]));

const PATHS = {
  phone: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
  email: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  pin: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
};

/** small icon, used here and in Page.jsx */
export function Icon({ name, size = 14 }) {
  if (name === 'web') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

function Bullets({ text }) {
  return (
    <ul className="rpl-bullets">
      <li>{text}</li>
    </ul>
  );
}

/** head block + one block per bullet, glued so the whole entry stays together */
function entry(id, head, ...descriptions) {
  const bullets = descriptions.flatMap((text) => textToBullets(text));
  return glue([
    { id: `${id}-head`, element: head },
    ...bullets.map((text, index) => ({ id: `${id}-b${index}`, element: <Bullets text={text} /> })),
  ]);
}

const heading = (id, title) => ({
  id,
  element: (
    <div className="rpl-hwrap">
      <h2 className="rpl-heading">{title}</h2>
    </div>
  ),
});

function EntryHead({ title, date, sub }) {
  return (
    <div className="rpl-entry-head">
      {has(title) ? <div className="rpl-entry-title">{title}</div> : null}
      {has(date) ? <div className="rpl-entry-date">{date}</div> : null}
      {has(sub) ? <div className="rpl-entry-sub">{sub}</div> : null}
    </div>
  );
}

// ───────── sidebar ─────────
function buildSidebar(data) {
  const blocks = [];

  const skills = (data.skills ?? []).filter(has);
  if (skills.length > 0) {
    blocks.push(
      ...section(heading('skills-h', 'Skills'), [
        [
          {
            id: 'skills',
            element: (
              <ul className="rpl-lines">
                {skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            ),
          },
        ],
      ]),
    );
  }

  const schools = (data.education ?? []).filter((school) => hasAny(school, ['institutionName', 'degree', 'fieldOfStudy']));
  blocks.push(
    ...section(
      heading('education-h', 'Education'),
      schools.map((school, index) =>
        entry(
          `edu-${index}`,
          <div className="rpl-side-entry">
            {has(dateRange(school.startDate, school.endDate, school.currentlyStudying)) ? (
              <div className="rpl-side-date">{dateRange(school.startDate, school.endDate, school.currentlyStudying)}</div>
            ) : null}
            {[school.institutionName, school.fieldOfStudy, school.degree, has(school.gpa) && `GPA ${school.gpa}`].filter(has).map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>,
          school.description,
        ),
      ),
    ),
  );

  const languages = (data.languages ?? []).filter((language) => has(language.name));
  if (languages.length > 0) {
    blocks.push(
      ...section(heading('languages-h', 'Languages'), [
        [
          {
            id: 'languages',
            element: (
              <ul className="rpl-lines">
                {languages.map((language) => (
                  <li key={language.id ?? language.name}>{joinNonEmpty([language.name, has(language.level) && `(${language.level})`], ' ')}</li>
                ))}
              </ul>
            ),
          },
        ],
      ]),
    );
  }
  return blocks;
}

// ───────── main column ─────────
function buildMain(data) {
  const blocks = [];

  if (has(data.professionalSummary)) {
    blocks.push(...section(heading('summary-h', 'Profile'), [[{ id: 'summary', element: <p className="rpl-paragraph">{data.professionalSummary}</p> }]]));
  }

  const jobs = (data.workExperience ?? []).filter((job) => hasAny(job, ['companyName', 'jobTitle', 'jobDescription']));
  blocks.push(
    ...section(
      heading('experience-h', 'Work Experience'),
      jobs.map((job, index) =>
        entry(
          `job-${index}`,
          <EntryHead
            title={joinNonEmpty([job.jobTitle, job.companyName], '  |  ')}
            date={dateRange(job.startDate, job.endDate, job.currentlyWorking)}
            sub={joinNonEmpty([job.location, job.employeeType], ' | ')}
          />,
          job.jobDescription,
        ),
      ),
    ),
  );

  const projects = (data.projects ?? []).filter((project) => hasAny(project, ['projectName', 'projectDescription']));
  blocks.push(
    ...section(
      heading('projects-h', 'Projects'),
      projects.map((project, index) => {
        const base = entry(
          `project-${index}`,
          <EntryHead
            title={joinNonEmpty([project.projectName, project.role], '  |  ')}
            date={project.projectType}
            sub={project.projectUrl ? <a className="rpl-link" href={safeHref(project.projectUrl) ?? undefined}>{prettyUrl(project.projectUrl)}</a> : null}
          />,
          project.projectDescription,
          project.keyResponsibilities,
          project.keyAchievements,
        );
        const tech = (project.technologies ?? []).filter(has);
        return tech.length > 0 ? glue([...base, { id: `project-${index}-tech`, element: <p className="rpl-tech">Tech: {tech.join(', ')}</p> }]) : base;
      }),
    ),
  );

  const references = (data.references ?? []).filter((reference) => hasAny(reference, ['name', 'company']));
  blocks.push(
    ...section(
      heading('references-h', 'References'),
      references.map((reference, index) => [
        {
          id: `ref-${index}`,
          element: (
            <div className="rpl-ref">
              <strong>{reference.name}</strong>
              <div className="rpl-entry-sub">{joinNonEmpty([reference.jobTitle, reference.company, reference.relationship])}</div>
              <div className="rpl-entry-sub">{joinNonEmpty([reference.email, reference.phone])}</div>
            </div>
          ),
        },
      ]),
    ),
  );

  return blocks;
}

export function buildBlocks(data) {
  return { sidebar: buildSidebar(data), main: buildMain(data) };
}
