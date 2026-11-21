import { glue, section } from '../../engine/blockKit';
import { dateRange, joinNonEmpty, prettyUrl, safeHref } from '../../lib/format';
import { textToBullets } from '../../lib/textToBullets';

/*
 * MODERN
 * sidebar -> Photo, Contact, Skills, Languages
 * main    -> Name, Profile, Experience, Education, Projects, References
 * Empty field / empty section -> no block at all.
 */

const has = (value) => (Array.isArray(value) ? value.length > 0 : String(value ?? '').trim() !== '');
const hasAny = (item, keys) => keys.some((key) => has(item?.[key]));

// kind: 'main' | 'side' | 'side-first' (the first heading in the sidebar has no top padding)
const HEADING_CLASS = {
  main: 'rmd-heading',
  side: 'rmd-heading rmd-heading-side',
  'side-first': 'rmd-heading rmd-heading-side rmd-heading-first',
};
const heading = (id, title, kind = 'main') => ({ id, element: <h2 className={HEADING_CLASS[kind]}>{title}</h2> });

function Bullets({ text }) {
  return (
    <ul className="rmd-bullets">
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

function EntryHead({ title, company, date, sub }) {
  return (
    <div className="rmd-job">
      {has(title) ? <div className="rmd-job-title">{title}</div> : null}
      {has(company) || has(date) ? (
        <div className="rmd-job-meta">
          <span className="rmd-company">{company}</span>
          <span className="rmd-muted">{date}</span>
        </div>
      ) : null}
      {has(sub) ? <div className="rmd-sub">{sub}</div> : null}
    </div>
  );
}

// ───────── main column ─────────
function buildMain(data) {
  const p = data.personalInformation ?? {};
  const main = [];

  if (has(p.fullName) || has(p.professionalTitle)) {
    main.push({
      id: 'header',
      element: (
        <div className="rmd-header">
          <h1 className="rmd-name">{p.fullName}</h1>
          {has(p.professionalTitle) ? <p className="rmd-title">{p.professionalTitle}</p> : null}
        </div>
      ),
    });
  }

  if (has(data.professionalSummary)) {
    main.push(...section(heading('summary-h', 'Profile'), [[{ id: 'summary', element: <p className="rmd-text">{data.professionalSummary}</p> }]]));
  }

  const jobs = (data.workExperience ?? []).filter((job) => hasAny(job, ['companyName', 'jobTitle', 'jobDescription']));
  main.push(
    ...section(
      heading('experience-h', 'Experience'),
      jobs.map((job, index) =>
        entry(
          `job-${index}`,
          <EntryHead
            title={job.jobTitle}
            company={job.companyName}
            date={dateRange(job.startDate, job.endDate, job.currentlyWorking)}
            sub={joinNonEmpty([job.location, job.employeeType], ' | ')}
          />,
          job.jobDescription,
        ),
      ),
    ),
  );

  const schools = (data.education ?? []).filter((school) => hasAny(school, ['institutionName', 'degree', 'fieldOfStudy']));
  main.push(
    ...section(
      heading('education-h', 'Education'),
      schools.map((school, index) =>
        entry(
          `edu-${index}`,
          <EntryHead
            title={joinNonEmpty([school.degree, school.fieldOfStudy], ' - ')}
            company={school.institutionName}
            date={dateRange(school.startDate, school.endDate, school.currentlyStudying)}
            sub={has(school.gpa) ? `GPA ${school.gpa}` : ''}
          />,
          school.description,
        ),
      ),
    ),
  );

  const projects = (data.projects ?? []).filter((project) => hasAny(project, ['projectName', 'projectDescription']));
  main.push(
    ...section(
      heading('projects-h', 'Projects'),
      projects.map((project, index) => {
        const base = entry(
          `project-${index}`,
          <EntryHead
            title={joinNonEmpty([project.projectName, project.role], ' - ')}
            company={project.projectUrl ? <a className="rmd-link" href={safeHref(project.projectUrl) ?? undefined}>{prettyUrl(project.projectUrl)}</a> : ''}
            date={project.projectType}
          />,
          project.projectDescription,
          project.keyResponsibilities,
          project.keyAchievements,
        );
        const tech = (project.technologies ?? []).filter(has);
        // technologies line is the last block of the entry
        return tech.length > 0 ? glue([...base, { id: `project-${index}-tech`, element: <p className="rmd-tech">Tech: {tech.join(', ')}</p> }]) : base;
      }),
    ),
  );

  const references = (data.references ?? []).filter((reference) => hasAny(reference, ['name', 'company']));
  main.push(
    ...section(
      heading('references-h', 'References'),
      references.map((reference, index) => [
        {
          id: `ref-${index}`,
          element: (
            <div className="rmd-ref">
              <strong>{reference.name}</strong>
              <div className="rmd-sub">{joinNonEmpty([reference.jobTitle, reference.company, reference.relationship])}</div>
              <div className="rmd-sub">{joinNonEmpty([reference.email, reference.phone])}</div>
            </div>
          ),
        },
      ]),
    ),
  );

  return main;
}

// ───────── sidebar column ─────────
function buildSidebar(data) {
  const p = data.personalInformation ?? {};
  const sidebar = [];

  if (p.photo?.url) {
    sidebar.push({ id: 'photo', element: <img className="rmd-photo" src={p.photo.url} alt="" /> });
  }
  // the first heading of the sidebar has no top padding (only when nothing is above it)
  const sideKind = () => (sidebar.length === 0 ? 'side-first' : 'side');

  const contact = [
    has(p.email) && { key: 'email', value: p.email, href: `mailto:${p.email}` },
    has(p.phone) && { key: 'phone', value: p.phone },
    has(p.location) && { key: 'location', value: p.location },
    has(p.linkedin) && { key: 'linkedin', value: prettyUrl(p.linkedin), href: safeHref(p.linkedin) },
    has(p.website) && { key: 'website', value: prettyUrl(p.website), href: safeHref(p.website) },
  ].filter(Boolean);
  if (contact.length > 0) {
    sidebar.push(
      ...section(heading('contact-h', 'Contact', sideKind()), [
        [
          {
            id: 'contact',
            element: (
              <ul className="rmd-list">
                {contact.map(({ key, value, href }) => (
                  <li key={key}>{href ? <a className="rmd-side-link" href={href}>{value}</a> : value}</li>
                ))}
              </ul>
            ),
          },
        ],
      ]),
    );
  }

  const skills = (data.skills ?? []).filter(has);
  if (skills.length > 0) {
    sidebar.push(
      ...section(
        heading('skills-h', 'Skills', sideKind()),
        skills.map((skill, index) => [{ id: `skill-${index}`, element: <p className="rmd-skill">{skill}</p> }]),
      ),
    );
  }

  const languages = (data.languages ?? []).filter((language) => has(language.name));
  if (languages.length > 0) {
    sidebar.push(
      ...section(heading('languages-h', 'Languages', sideKind()), [
        [
          {
            id: 'languages',
            element: (
              <ul className="rmd-list">
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

  return sidebar;
}

export function buildBlocks(data) {
  return { sidebar: buildSidebar(data), main: buildMain(data) };
}
