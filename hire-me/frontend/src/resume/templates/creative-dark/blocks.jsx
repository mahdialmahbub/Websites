import { glue, section } from '../../engine/blockKit';
import { dateRange, joinNonEmpty, prettyUrl, safeHref } from '../../lib/format';
import { textToBullets } from '../../lib/textToBullets';

/*
 * CREATIVE DARK - three visual columns, but the engine only knows two block columns:
 *   main    (LEFT column)   -> Profile, Experiences, Projects
 *   sidebar (RIGHT column)  -> Education, Skills, Languages, References
 *   centre strip (photo, name, title, address / phone / email, links) is drawn by Page.jsx on the first page.
 */

const has = (value) => (Array.isArray(value) ? value.length > 0 : String(value ?? '').trim() !== '');
const hasAny = (item, keys) => keys.some((key) => has(item?.[key]));

function Bullets({ text }) {
  return (
    <ul className="rcd-bullets">
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
    <div className="rcd-hwrap">
      <h2 className="rcd-heading">{title}</h2>
    </div>
  ),
});

function EntryHead({ company, role, date }) {
  return (
    <div className="rcd-entry-head">
      {has(company) ? <div className="rcd-company">{company}</div> : null}
      {has(role) ? <div className="rcd-role">{role}</div> : null}
      {has(date) ? <div className="rcd-date">{date}</div> : null}
    </div>
  );
}

// ───────── left column (main) ─────────
function buildMain(data) {
  const blocks = [];

  if (has(data.professionalSummary)) {
    blocks.push(...section(heading('summary-h', 'Profile'), [[{ id: 'summary', element: <p className="rcd-paragraph">{data.professionalSummary}</p> }]]));
  }

  const jobs = (data.workExperience ?? []).filter((job) => hasAny(job, ['companyName', 'jobTitle', 'jobDescription']));
  blocks.push(
    ...section(
      heading('experience-h', 'Experiences'),
      jobs.map((job, index) =>
        entry(
          `job-${index}`,
          <EntryHead
            company={has(job.companyName) ? job.companyName : job.jobTitle}
            role={has(job.companyName) ? joinNonEmpty([job.jobTitle, job.employeeType], ' | ') : ''}
            date={joinNonEmpty([dateRange(job.startDate, job.endDate, job.currentlyWorking), job.location], ' | ')}
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
            company={project.projectName}
            role={project.role}
            date={project.projectUrl ? undefined : project.projectType}
          />,
          project.projectDescription,
          project.keyResponsibilities,
          project.keyAchievements,
        );
        const tech = (project.technologies ?? []).filter(has);
        const tail = [];
        if (project.projectUrl) {
          tail.push({
            id: `project-${index}-link`,
            element: (
              <p className="rcd-tech">
                <a className="rcd-link-text" href={safeHref(project.projectUrl) ?? undefined}>
                  {prettyUrl(project.projectUrl)}
                </a>
              </p>
            ),
          });
        }
        if (tech.length > 0) tail.push({ id: `project-${index}-tech`, element: <p className="rcd-tech">Tech: {tech.join(', ')}</p> });
        return tail.length > 0 ? glue([...base, ...tail]) : base;
      }),
    ),
  );

  return blocks;
}

// ───────── right column (sidebar) ─────────
function buildSidebar(data) {
  const blocks = [];

  const schools = (data.education ?? []).filter((school) => hasAny(school, ['institutionName', 'degree', 'fieldOfStudy']));
  blocks.push(
    ...section(
      heading('education-h', 'Education'),
      schools.map((school, index) =>
        entry(
          `edu-${index}`,
          <EntryHead
            company={school.institutionName}
            role={joinNonEmpty([school.degree, school.fieldOfStudy], ' - ')}
            date={joinNonEmpty([dateRange(school.startDate, school.endDate, school.currentlyStudying), has(school.gpa) && `GPA ${school.gpa}`], ' | ')}
          />,
          school.description,
        ),
      ),
    ),
  );

  const skills = (data.skills ?? []).filter(has);
  if (skills.length > 0) {
    blocks.push(
      ...section(heading('skills-h', 'Skills'), [
        [
          {
            id: 'skills',
            element: (
              <ul className="rcd-hexlist">
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

  const languages = (data.languages ?? []).filter((language) => has(language.name));
  if (languages.length > 0) {
    blocks.push(
      ...section(heading('languages-h', 'Languages'), [
        [
          {
            id: 'languages',
            element: (
              <ul className="rcd-hexlist">
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

  const references = (data.references ?? []).filter((reference) => hasAny(reference, ['name', 'company']));
  blocks.push(
    ...section(
      heading('references-h', 'References'),
      references.map((reference, index) => [
        {
          id: `ref-${index}`,
          element: (
            <div className="rcd-entry-head">
              <div className="rcd-role">{reference.name}</div>
              <div className="rcd-date">{joinNonEmpty([reference.jobTitle, reference.company, reference.relationship])}</div>
              <div className="rcd-date">{joinNonEmpty([reference.email, reference.phone])}</div>
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
