import { glue, section } from '../../engine/blockKit';
import { dateRange, joinNonEmpty, prettyUrl, safeHref } from '../../lib/format';
import { textToBullets } from '../../lib/textToBullets';

/*
 * EXECUTIVE (name banner + photo are drawn by Page.jsx on the first page)
 * sidebar -> Contact, Skills, Education, Languages
 * main    -> About Me, Work Experience (timeline), Projects, References
 */

const has = (value) => (Array.isArray(value) ? value.length > 0 : String(value ?? '').trim() !== '');
const hasAny = (item, keys) => keys.some((key) => has(item?.[key]));

const PATHS = {
  phone: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
  email: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  pin: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
};

function Icon({ name }) {
  if (name === 'web') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

/** "Jan 2020 - Present" -> ["Jan 2020", "Present"] (two lines inside the date tag) */
function splitDates(range) {
  const parts = String(range ?? '').trim().split(/\s+(?:-|–|—|to)\s+/i);
  return [parts[0], parts[1]].filter(has);
}

function Bullets({ text, side = false }) {
  return (
    <ul className={side ? 'rex-bullets rex-bullets-side' : 'rex-bullets'}>
      <li>{text}</li>
    </ul>
  );
}

const heading = (id, title) => ({ id, element: <h2 className="rex-heading">{title}</h2> });
const sideHeading = (id, title) => ({ id, element: <h2 className="rex-side-heading">{title}</h2> });

/** plain entry (projects, education): head block + one block per bullet, glued together */
function entry(id, head, side, ...descriptions) {
  const bullets = descriptions.flatMap((text) => textToBullets(text));
  return glue([
    { id: `${id}-head`, element: head },
    ...bullets.map((text, index) => ({ id: `${id}-b${index}`, element: <Bullets text={text} side={side} /> })),
  ]);
}

/** timeline entry: date tag + dot + vertical line run through every block of the job */
function jobEntry(job, index) {
  const dates = splitDates(dateRange(job.startDate, job.endDate, job.currentlyWorking));
  const bullets = textToBullets(job.jobDescription);
  const title = has(job.jobTitle) ? job.jobTitle : job.companyName;
  const sub = has(job.jobTitle) ? joinNonEmpty([job.companyName, job.location, job.employeeType], ' | ') : joinNonEmpty([job.location, job.employeeType], ' | ');
  return glue([
    {
      id: `job-${index}-head`,
      element: (
        <div className="rex-job">
          {dates.length > 0 ? (
            <span className="rex-tag">
              {dates.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          ) : null}
          <div className="rex-job-title">{title}</div>
          {has(sub) ? <div className="rex-job-sub">{sub}</div> : null}
        </div>
      ),
    },
    ...bullets.map((text, i) => ({
      id: `job-${index}-b${i}`,
      element: (
        <div className="rex-job-line">
          <Bullets text={text} />
        </div>
      ),
    })),
  ]);
}

// ───────── sidebar ─────────
function buildSidebar(data) {
  const p = data.personalInformation ?? {};
  const blocks = [];

  const contact = [
    has(p.phone) && { key: 'phone', icon: 'phone', label: 'Phone', value: p.phone },
    has(p.email) && { key: 'email', icon: 'email', label: 'Email', value: p.email, href: `mailto:${p.email}` },
    has(p.website) && { key: 'website', icon: 'web', label: 'Web', value: prettyUrl(p.website), href: safeHref(p.website) },
    has(p.linkedin) && { key: 'linkedin', icon: 'web', label: 'LinkedIn', value: prettyUrl(p.linkedin), href: safeHref(p.linkedin) },
    has(p.location) && { key: 'location', icon: 'pin', label: 'Address', value: p.location },
  ].filter(Boolean);
  if (contact.length > 0) {
    blocks.push(
      ...section(
        sideHeading('contact-h', 'Contact'),
        contact.map(({ key, icon, label, value, href }) => [
          {
            id: `contact-${key}`,
            element: (
              <div className="rex-contact">
                <span className="rex-ico">
                  <Icon name={icon} />
                </span>
                <span className="rex-contact-text">
                  <span className="rex-label">{label}</span>
                  {href ? (
                    <a className="rex-side-link" href={href}>
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </span>
              </div>
            ),
          },
        ]),
      ),
    );
  }

  const skills = (data.skills ?? []).filter(has);
  if (skills.length > 0) {
    blocks.push(
      ...section(
        sideHeading('skills-h', 'Skills'),
        skills.map((skill, index) => [{ id: `skill-${index}`, element: <div className="rex-skill">{skill}</div> }]),
      ),
    );
  }

  const schools = (data.education ?? []).filter((school) => hasAny(school, ['institutionName', 'degree', 'fieldOfStudy']));
  blocks.push(
    ...section(
      sideHeading('education-h', 'Education'),
      schools.map((school, index) =>
        entry(
          `edu-${index}`,
          <div className="rex-edu">
            {has(dateRange(school.startDate, school.endDate, school.currentlyStudying)) ? (
              <div className="rex-edu-date">{dateRange(school.startDate, school.endDate, school.currentlyStudying)}</div>
            ) : null}
            <div className="rex-edu-degree">{joinNonEmpty([school.degree, school.fieldOfStudy], ' - ') || school.institutionName}</div>
            {has(school.degree) || has(school.fieldOfStudy) ? <div className="rex-edu-school">{school.institutionName}</div> : null}
            {has(school.gpa) ? <div className="rex-edu-school">GPA {school.gpa}</div> : null}
          </div>,
          true,
          school.description,
        ),
      ),
    ),
  );

  const languages = (data.languages ?? []).filter((language) => has(language.name));
  if (languages.length > 0) {
    blocks.push(
      ...section(sideHeading('languages-h', 'Languages'), [
        [
          {
            id: 'languages',
            element: (
              <ul className="rex-lines">
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
    blocks.push(...section(heading('summary-h', 'About Me'), [[{ id: 'summary', element: <p className="rex-paragraph">{data.professionalSummary}</p> }]]));
  }

  const jobs = (data.workExperience ?? []).filter((job) => hasAny(job, ['companyName', 'jobTitle', 'jobDescription']));
  blocks.push(...section(heading('experience-h', 'Work Experience'), jobs.map(jobEntry)));

  const projects = (data.projects ?? []).filter((project) => hasAny(project, ['projectName', 'projectDescription']));
  blocks.push(
    ...section(
      heading('projects-h', 'Projects'),
      projects.map((project, index) => {
        const base = entry(
          `project-${index}`,
          <div className="rex-entry-head">
            <div className="rex-job-title">{joinNonEmpty([project.projectName, project.role], ' - ')}</div>
            {project.projectUrl ? (
              <div className="rex-job-sub">
                <a className="rex-link" href={safeHref(project.projectUrl) ?? undefined}>
                  {prettyUrl(project.projectUrl)}
                </a>
              </div>
            ) : has(project.projectType) ? (
              <div className="rex-job-sub">{project.projectType}</div>
            ) : null}
          </div>,
          false,
          project.projectDescription,
          project.keyResponsibilities,
          project.keyAchievements,
        );
        const tech = (project.technologies ?? []).filter(has);
        return tech.length > 0 ? glue([...base, { id: `project-${index}-tech`, element: <p className="rex-tech">Tech: {tech.join(', ')}</p> }]) : base;
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
            <div className="rex-ref">
              <strong>{reference.name}</strong>
              <div className="rex-job-sub">{joinNonEmpty([reference.jobTitle, reference.company, reference.relationship])}</div>
              <div className="rex-job-sub">{joinNonEmpty([reference.email, reference.phone])}</div>
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
