import { glue, section } from '../../engine/blockKit';
import { dateRange, joinNonEmpty, prettyUrl, safeHref } from '../../lib/format';
import { textToBullets } from '../../lib/textToBullets';

/*
 * buildBlocks(data) cuts the resume into BLOCKS (heading, one job's header line, one bullet ...).
 * It only decides WHAT is shown. The engine decides WHICH PAGE each block lands on.
 *   - empty section / empty entry -> no block at all (the section disappears)
 *   - every description goes through textToBullets
 */

const has = (value) => (Array.isArray(value) ? value.length > 0 : String(value ?? '').trim() !== '');
const hasAny = (item, keys) => keys.some((key) => has(item?.[key]));

function Bullets({ text }) {
  return (
    <ul className="rbp-bullets">
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

const heading = (id, title) => ({ id, element: <h2 className="rbp-heading">{title}</h2> });
const sideHeading = (id, title) => ({ id, element: <h2 className="rbp-side-heading">{title}</h2> });

function EntryHead({ title, date, sub }) {
  return (
    <div className="rbp-entry-head">
      <div className="rbp-entry-row">
        <span className="rbp-entry-title">{title}</span>
        {date ? <span className="rbp-entry-date">{date}</span> : null}
      </div>
      {sub ? <div className="rbp-entry-sub">{sub}</div> : null}
    </div>
  );
}

// ───────── sidebar ─────────
function buildSidebar(data) {
  const p = data.personalInformation ?? {};
  const blocks = [];

  if (p.photo?.url) {
    blocks.push({ id: 'photo', element: <img className="rbp-photo" src={p.photo.url} alt="" /> });
  }

  // Contact: only the lines that have a value
  const contact = [
    p.email && { label: 'Email', value: p.email, href: `mailto:${p.email}` },
    p.phone && { label: 'Phone', value: p.phone },
    p.location && { label: 'Location', value: p.location },
    p.linkedin && { label: 'LinkedIn', value: prettyUrl(p.linkedin), href: safeHref(p.linkedin) },
    p.website && { label: 'Website', value: prettyUrl(p.website), href: safeHref(p.website) },
  ].filter(Boolean);
  if (contact.length > 0) {
    blocks.push(
      ...section(
        sideHeading('contact-h', 'Contact'),
        [[{
          id: 'contact',
          element: (
            <ul className="rbp-side-list">
              {contact.map(({ label, value, href }) => (
                <li key={label}>
                  <span className="rbp-side-label">{label}</span>
                  {href ? <a className="rbp-side-link" href={href}>{value}</a> : value}
                </li>
              ))}
            </ul>
          ),
        }]],
      ),
    );
  }

  const skills = (data.skills ?? []).filter(has);
  if (skills.length > 0) {
    blocks.push(
      ...section(sideHeading('skills-h', 'Skills'), [[{
        id: 'skills',
        element: <div className="rbp-chips">{skills.map((skill) => <span className="rbp-chip" key={skill}>{skill}</span>)}</div>,
      }]]),
    );
  }

  const languages = (data.languages ?? []).filter((language) => has(language.name));
  if (languages.length > 0) {
    blocks.push(
      ...section(sideHeading('languages-h', 'Languages'), [[{
        id: 'languages',
        element: (
          <ul className="rbp-side-list">
            {languages.map((language) => (
              <li key={language.id ?? language.name}>{joinNonEmpty([language.name, language.level && `(${language.level})`], ' ')}</li>
            ))}
          </ul>
        ),
      }]]),
    );
  }
  return blocks;
}

// ───────── main column ─────────
function buildMain(data) {
  const p = data.personalInformation ?? {};
  const blocks = [];

  if (has(p.fullName) || has(p.professionalTitle)) {
    blocks.push({
      id: 'header',
      element: (
        <div>
          <h1 className="rbp-name">{p.fullName}</h1>
          {has(p.professionalTitle) ? <p className="rbp-title">{p.professionalTitle}</p> : null}
        </div>
      ),
    });
  }

  if (has(data.professionalSummary)) {
    blocks.push(
      ...section(heading('summary-h', 'Summary'), [[{ id: 'summary', element: <p className="rbp-paragraph">{data.professionalSummary}</p> }]]),
    );
  }

  const jobs = (data.workExperience ?? []).filter((job) => hasAny(job, ['companyName', 'jobTitle', 'jobDescription']));
  blocks.push(
    ...section(
      heading('experience-h', 'Experience'),
      jobs.map((job, index) =>
        entry(
          `job-${index}`,
          <EntryHead
            title={joinNonEmpty([job.jobTitle, job.companyName], ' - ')}
            date={dateRange(job.startDate, job.endDate, job.currentlyWorking)}
            sub={joinNonEmpty([job.location, job.employeeType], ' | ')}
          />,
          job.jobDescription,
        ),
      ),
    ),
  );

  const schools = (data.education ?? []).filter((school) => hasAny(school, ['institutionName', 'degree', 'fieldOfStudy']));
  blocks.push(
    ...section(
      heading('education-h', 'Education'),
      schools.map((school, index) =>
        entry(
          `edu-${index}`,
          <EntryHead
            title={school.institutionName}
            date={dateRange(school.startDate, school.endDate, school.currentlyStudying)}
            sub={joinNonEmpty([school.degree, school.fieldOfStudy, has(school.gpa) && `GPA ${school.gpa}`])}
          />,
          school.description,
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
            title={joinNonEmpty([project.projectName, project.role], ' - ')}
            date={project.projectType}
            sub={project.projectUrl ? <a className="rbp-link" href={safeHref(project.projectUrl) ?? undefined}>{prettyUrl(project.projectUrl)}</a> : null}
          />,
          project.projectDescription,
          project.keyResponsibilities,
          project.keyAchievements,
        );
        const tech = (project.technologies ?? []).filter(has);
        // technologies line is the last block of the entry
        return tech.length > 0 ? glue([...base, { id: `project-${index}-tech`, element: <p className="rbp-tech">Tech: {tech.join(', ')}</p> }]) : base;
      }),
    ),
  );

  const references = (data.references ?? []).filter((reference) => hasAny(reference, ['name', 'company']));
  blocks.push(
    ...section(
      heading('references-h', 'References'),
      references.map((reference, index) => [{
        id: `ref-${index}`,
        element: (
          <div className="rbp-ref">
            <strong>{reference.name}</strong>
            <div className="rbp-entry-sub">{joinNonEmpty([reference.jobTitle, reference.company, reference.relationship])}</div>
            <div className="rbp-entry-sub">{joinNonEmpty([reference.email, reference.phone])}</div>
          </div>
        ),
      }]),
    ),
  );

  return blocks;
}

export function buildBlocks(data) {
  return { sidebar: buildSidebar(data), main: buildMain(data) };
}
