import { glue, section } from '../../engine/blockKit';
import { dateRange, joinNonEmpty, prettyUrl, safeHref } from '../../lib/format';
import { textToBullets } from '../../lib/textToBullets';

/*
 * WAVE (photo, name and title are drawn by Page.jsx on the first page)
 * sidebar (left) -> Contact, Skills, Education, Languages
 * main (right)   -> Professional Summary, Work Experience, Projects, References
 * Empty field / empty section -> no block at all.
 */

const has = (value) => (Array.isArray(value) ? value.length > 0 : String(value ?? '').trim() !== '');
const hasAny = (item, keys) => keys.some((key) => has(item?.[key]));

const PATHS = {
  phone: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
  email: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  pin: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  work: 'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z',
  school: 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z',
};

function Icon({ name, size = 15 }) {
  if (name === 'web') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
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
    <ul className="rwv-bullets">
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

// sidebar heading: a thin line above it, except for the very first one (rule = false)
const sideHeading = (id, title, rule, icon) => ({
  id,
  element: (
    <div className="rwv-hout">
      <h2 className={rule ? 'rwv-side-h rwv-ruled' : 'rwv-side-h'}>
        {icon ? (
          <span className="rwv-h-ico">
            <Icon name={icon} size={18} />
          </span>
        ) : null}
        {title}
      </h2>
    </div>
  ),
});
// main heading: light bar, a thin line above it (rule = false for the very first one)
const mainHeading = (id, title, rule) => ({
  id,
  element: (
    <div className="rwv-hout">
      <div className={rule ? 'rwv-hwrap rwv-ruled' : 'rwv-hwrap'}>
        <h2 className="rwv-heading">{title}</h2>
      </div>
    </div>
  ),
});

// ───────── left column (sidebar) ─────────
function buildSidebar(data) {
  const p = data.personalInformation ?? {};
  const blocks = [];
  const ruled = () => blocks.length > 0;

  const contact = [
    has(p.phone) && { key: 'phone', icon: 'phone', value: p.phone },
    has(p.email) && { key: 'email', icon: 'email', value: p.email, href: `mailto:${p.email}` },
    has(p.location) && { key: 'location', icon: 'pin', value: p.location },
    has(p.linkedin) && { key: 'linkedin', icon: 'web', value: prettyUrl(p.linkedin), href: safeHref(p.linkedin) },
    has(p.website) && { key: 'website', icon: 'web', value: prettyUrl(p.website), href: safeHref(p.website) },
  ].filter(Boolean);
  if (contact.length > 0) {
    blocks.push(
      ...section(
        sideHeading('contact-h', 'Contact', ruled()),
        contact.map(({ key, icon, value, href }) => [
          {
            id: `contact-${key}`,
            element: (
              <div className="rwv-contact">
                <span className="rwv-ico">
                  <Icon name={icon} />
                </span>
                {href ? (
                  <a className="rwv-link-plain" href={href}>
                    {value}
                  </a>
                ) : (
                  <span>{value}</span>
                )}
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
      ...section(sideHeading('skills-h', 'Skills', ruled()), [
        [
          {
            id: 'skills',
            element: (
              <ul className="rwv-list">
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
      sideHeading('education-h', 'Education', ruled(), 'school'),
      schools.map((school, index) =>
        entry(
          `edu-${index}`,
          <div className="rwv-edu">
            <div className="rwv-edu-degree">{joinNonEmpty([school.degree, school.fieldOfStudy], ' - ') || school.institutionName}</div>
            {has(joinNonEmpty([school.degree, school.fieldOfStudy])) && has(school.institutionName) ? <div>{school.institutionName}</div> : null}
            {has(dateRange(school.startDate, school.endDate, school.currentlyStudying)) ? <div>{dateRange(school.startDate, school.endDate, school.currentlyStudying)}</div> : null}
            {has(school.gpa) ? <div>GPA {school.gpa}</div> : null}
          </div>,
          school.description,
        ),
      ),
    ),
  );

  const languages = (data.languages ?? []).filter((language) => has(language.name));
  if (languages.length > 0) {
    blocks.push(
      ...section(sideHeading('languages-h', 'Languages', ruled()), [
        [
          {
            id: 'languages',
            element: (
              <ul className="rwv-list">
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

// ───────── right column (main) ─────────
function buildMain(data) {
  const blocks = [];
  const ruled = () => blocks.length > 0;

  if (has(data.professionalSummary)) {
    blocks.push(...section(mainHeading('summary-h', 'Professional Summary', ruled()), [[{ id: 'summary', element: <p className="rwv-paragraph">{data.professionalSummary}</p> }]]));
  }

  const jobs = (data.workExperience ?? []).filter((job) => hasAny(job, ['companyName', 'jobTitle', 'jobDescription']));
  const jobBlocks = section(
    mainHeading('experience-h', 'Work Experience', ruled()),
    jobs.map((job, index) =>
      entry(
        `job-${index}`,
        <div className="rwv-job">
          <span className="rwv-job-ico">
            <Icon name="work" size={16} />
          </span>
          <div className="rwv-job-body">
            <div className="rwv-job-row">
              <span className="rwv-job-title">{has(job.jobTitle) ? job.jobTitle : job.companyName}</span>
              <span className="rwv-job-date">{dateRange(job.startDate, job.endDate, job.currentlyWorking)}</span>
            </div>
            {has(joinNonEmpty([has(job.jobTitle) ? job.companyName : '', job.location, job.employeeType], ', ')) ? (
              <div className="rwv-job-sub">{joinNonEmpty([has(job.jobTitle) ? job.companyName : '', job.location, job.employeeType], ', ')}</div>
            ) : null}
          </div>
        </div>,
        job.jobDescription,
      ),
    ),
  );
  blocks.push(...jobBlocks);

  const projects = (data.projects ?? []).filter((project) => hasAny(project, ['projectName', 'projectDescription']));
  blocks.push(
    ...section(
      mainHeading('projects-h', 'Projects', ruled()),
      projects.map((project, index) => {
        const base = entry(
          `project-${index}`,
          <div className="rwv-job">
            <span className="rwv-job-ico">
              <Icon name="work" size={16} />
            </span>
            <div className="rwv-job-body">
              <div className="rwv-job-row">
                <span className="rwv-job-title">{joinNonEmpty([project.projectName, project.role], ' - ')}</span>
                <span className="rwv-job-date">{project.projectType}</span>
              </div>
              {project.projectUrl ? (
                <div className="rwv-job-sub">
                  <a className="rwv-link" href={safeHref(project.projectUrl) ?? undefined}>
                    {prettyUrl(project.projectUrl)}
                  </a>
                </div>
              ) : null}
            </div>
          </div>,
          project.projectDescription,
          project.keyResponsibilities,
          project.keyAchievements,
        );
        const tech = (project.technologies ?? []).filter(has);
        // technologies line is the last block of the entry
        return tech.length > 0 ? glue([...base, { id: `project-${index}-tech`, element: <p className="rwv-tech">Tech: {tech.join(', ')}</p> }]) : base;
      }),
    ),
  );

  const references = (data.references ?? []).filter((reference) => hasAny(reference, ['name', 'company']));
  blocks.push(
    ...section(
      mainHeading('references-h', 'References', ruled()),
      references.map((reference, index) => [
        {
          id: `ref-${index}`,
          element: (
            <div className="rwv-ref">
              <strong>{reference.name}</strong>
              <div className="rwv-job-sub">{joinNonEmpty([reference.jobTitle, reference.company, reference.relationship])}</div>
              <div className="rwv-job-sub">{joinNonEmpty([reference.email, reference.phone])}</div>
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
