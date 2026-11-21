import { glue, section } from '../../engine/blockKit';
import { dateRange, joinNonEmpty, prettyUrl, safeHref } from '../../lib/format';
import { textToBullets } from '../../lib/textToBullets';

/*
 * MINIMAL - single column, everything goes into `main`, `sidebar` stays empty.
 * Order: Summary, Professional Experience, Education, Projects, Skills, Languages, References.
 * (No photo: this layout is text only.) Empty field / empty section -> no block at all.
 */

const has = (value) => (Array.isArray(value) ? value.length > 0 : String(value ?? '').trim() !== '');
const hasAny = (item, keys) => keys.some((key) => has(item?.[key]));
const heading = (id, title) => ({ id, element: <h2 className="rmn-heading">{title}</h2> });

function Bullets({ text }) {
  return (
    <ul className="rmn-bullets">
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

/** left text, right text, optional italic line under them */
function EntryHead({ left, right, role }) {
  return (
    <div className="rmn-job">
      <div className="rmn-row">
        <span>{left}</span>
        {has(right) ? <span>{right}</span> : null}
      </div>
      {has(role) ? <div className="rmn-role">{role}</div> : null}
    </div>
  );
}

/** Turn the resume data into blocks. Single column: everything goes into `main`, `sidebar` stays empty. */
export function buildBlocks(data) {
  const p = data.personalInformation ?? {};
  const main = [];

  const contact = joinNonEmpty(
    [p.email, p.phone, p.location, has(p.linkedin) && prettyUrl(p.linkedin), has(p.website) && prettyUrl(p.website)],
    '  •  ',
  );
  if (has(p.fullName) || has(p.professionalTitle) || has(contact)) {
    main.push({
      id: 'header',
      element: (
        <div>
          <h1 className="rmn-name">{p.fullName}</h1>
          {has(p.professionalTitle) ? <p className="rmn-title">{p.professionalTitle}</p> : null}
          {has(contact) ? <p className="rmn-contact">{contact}</p> : null}
        </div>
      ),
    });
  }

  if (has(data.professionalSummary)) {
    main.push(...section(heading('summary-h', 'Summary'), [[{ id: 'summary', element: <p className="rmn-text">{data.professionalSummary}</p> }]]));
  }

  const jobs = (data.workExperience ?? []).filter((job) => hasAny(job, ['companyName', 'jobTitle', 'jobDescription']));
  main.push(
    ...section(
      heading('experience-h', 'Professional Experience'),
      jobs.map((job, index) =>
        entry(
          `job-${index}`,
          <EntryHead
            left={has(job.companyName) ? job.companyName : job.jobTitle}
            right={dateRange(job.startDate, job.endDate, job.currentlyWorking)}
            role={joinNonEmpty([has(job.companyName) ? job.jobTitle : '', job.location, job.employeeType], ' | ')}
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
            left={has(school.institutionName) ? school.institutionName : joinNonEmpty([school.degree, school.fieldOfStudy], ', ')}
            right={dateRange(school.startDate, school.endDate, school.currentlyStudying)}
            role={joinNonEmpty([has(school.institutionName) ? joinNonEmpty([school.degree, school.fieldOfStudy], ', ') : '', has(school.gpa) && `GPA ${school.gpa}`], ' | ')}
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
            left={joinNonEmpty([project.projectName, project.role], ' - ')}
            right={project.projectType}
            role={project.projectUrl ? <a className="rmn-link" href={safeHref(project.projectUrl) ?? undefined}>{prettyUrl(project.projectUrl)}</a> : ''}
          />,
          project.projectDescription,
          project.keyResponsibilities,
          project.keyAchievements,
        );
        const tech = (project.technologies ?? []).filter(has);
        // technologies line is the last block of the entry
        return tech.length > 0 ? glue([...base, { id: `project-${index}-tech`, element: <p className="rmn-tech">Tech: {tech.join(', ')}</p> }]) : base;
      }),
    ),
  );

  const skills = (data.skills ?? []).filter(has);
  if (skills.length > 0) {
    main.push(...section(heading('skills-h', 'Skills'), [[{ id: 'skills', element: <p className="rmn-text">{skills.join(', ')}</p> }]]));
  }

  const languages = (data.languages ?? []).filter((language) => has(language.name));
  if (languages.length > 0) {
    main.push(
      ...section(heading('languages-h', 'Languages'), [
        [
          {
            id: 'languages',
            element: (
              <p className="rmn-text">
                {languages.map((language) => joinNonEmpty([language.name, has(language.level) && `(${language.level})`], ' ')).join(', ')}
              </p>
            ),
          },
        ],
      ]),
    );
  }

  const references = (data.references ?? []).filter((reference) => hasAny(reference, ['name', 'company']));
  main.push(
    ...section(
      heading('references-h', 'References'),
      references.map((reference, index) => [
        {
          id: `ref-${index}`,
          element: (
            <div className="rmn-ref">
              <strong>{reference.name}</strong>
              <div>{joinNonEmpty([reference.jobTitle, reference.company, reference.relationship])}</div>
              <div>{joinNonEmpty([reference.email, reference.phone])}</div>
            </div>
          ),
        },
      ]),
    ),
  );

  return { sidebar: [], main };
}
