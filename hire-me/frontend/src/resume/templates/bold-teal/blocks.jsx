import { glue, section } from '../../engine/blockKit';
import { dateRange, joinNonEmpty, prettyUrl, safeHref } from '../../lib/format';
import { textToBullets } from '../../lib/textToBullets';

/*
 * BOLD TEAL
 * sidebar -> Photo, Contact, Skills, Languages
 * main    -> Name block, Profile, Education, Experience, Projects, References
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
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

function Bullets({ text }) {
  return (
    <ul className="rbt-bullets">
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

const heading = (id, title) => ({ id, element: <h2 className="rbt-heading">{title}</h2> });
const sideHeading = (id, title) => ({ id, element: <h2 className="rbt-side-heading">{title}</h2> });

function EntryHead({ date, title, sub }) {
  return (
    <div className="rbt-entry-head">
      {has(date) ? <div className="rbt-entry-date">{date}</div> : null}
      {has(title) ? <div className="rbt-entry-title">{title}</div> : null}
      {has(sub) ? <div className="rbt-entry-sub">{sub}</div> : null}
    </div>
  );
}

/** "Olivia Brown" -> two lines, the first letter of each word is bold */
function SplitName({ name }) {
  const words = String(name ?? '').trim().split(/\s+/).filter(Boolean);
  return words.map((word, index) => (
    <span className="rbt-name-word" key={index}>
      <b>{word.charAt(0)}</b>
      {word.slice(1)}
    </span>
  ));
}

// ───────── sidebar ─────────
function buildSidebar(data) {
  const p = data.personalInformation ?? {};
  const blocks = [];

  if (p.photo?.url) {
    blocks.push({
      id: 'photo',
      element: (
        <div className="rbt-photo-wrap">
          <img className="rbt-photo" src={p.photo.url} alt="" />
        </div>
      ),
    });
  }

  const contact = [
    has(p.location) && { key: 'location', icon: 'pin', value: p.location },
    has(p.email) && { key: 'email', icon: 'email', value: p.email, href: `mailto:${p.email}` },
    has(p.phone) && { key: 'phone', icon: 'phone', value: p.phone },
    has(p.website) && { key: 'website', icon: 'web', value: prettyUrl(p.website), href: safeHref(p.website) },
    has(p.linkedin) && { key: 'linkedin', icon: 'web', value: prettyUrl(p.linkedin), href: safeHref(p.linkedin) },
  ].filter(Boolean);
  if (contact.length > 0) {
    blocks.push(
      ...section(sideHeading('contact-h', 'Contact'), [
        [
          {
            id: 'contact',
            element: (
              <ul className="rbt-contact">
                {contact.map(({ key, icon, value, href }) => (
                  <li key={key}>
                    <span className="rbt-ico">
                      <Icon name={icon} />
                    </span>
                    {href ? (
                      <a className="rbt-side-link" href={href}>
                        {value}
                      </a>
                    ) : (
                      <span>{value}</span>
                    )}
                  </li>
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
    blocks.push(
      ...section(sideHeading('skills-h', 'Skills'), [
        [
          {
            id: 'skills',
            element: (
              <ul className="rbt-skills">
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
      ...section(sideHeading('languages-h', 'Languages'), [
        [
          {
            id: 'languages',
            element: (
              <ul className="rbt-skills">
                {languages.map((language) => (
                  <li className="rbt-lang" key={language.id ?? language.name}>
                    <span>{language.name}</span>
                    {has(language.level) ? <span className="rbt-lang-level">{language.level}</span> : null}
                  </li>
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
  const p = data.personalInformation ?? {};
  const blocks = [];

  if (has(p.fullName) || has(p.professionalTitle)) {
    blocks.push({
      id: 'header',
      element: (
        <div className="rbt-name-pad">
          <div className="rbt-namebox">
            <h1 className="rbt-name">
              <SplitName name={p.fullName} />
            </h1>
            {has(p.professionalTitle) ? <p className="rbt-title">{p.professionalTitle}</p> : null}
          </div>
        </div>
      ),
    });
  }

  if (has(data.professionalSummary)) {
    blocks.push(...section(heading('summary-h', 'Profile'), [[{ id: 'summary', element: <p className="rbt-paragraph">{data.professionalSummary}</p> }]]));
  }

  const schools = (data.education ?? []).filter((school) => hasAny(school, ['institutionName', 'degree', 'fieldOfStudy']));
  blocks.push(
    ...section(
      heading('education-h', 'Education'),
      schools.map((school, index) => {
        const degree = joinNonEmpty([school.degree, school.fieldOfStudy], ' - ');
        const gpa = has(school.gpa) ? `GPA ${school.gpa}` : '';
        return entry(
          `edu-${index}`,
          <EntryHead
            date={dateRange(school.startDate, school.endDate, school.currentlyStudying)}
            title={degree || school.institutionName}
            sub={degree ? joinNonEmpty([school.institutionName, gpa], ' | ') : gpa}
          />,
          school.description,
        );
      }),
    ),
  );

  const jobs = (data.workExperience ?? []).filter((job) => hasAny(job, ['companyName', 'jobTitle', 'jobDescription']));
  blocks.push(
    ...section(
      heading('experience-h', 'Experience'),
      jobs.map((job, index) =>
        entry(
          `job-${index}`,
          <EntryHead
            date={dateRange(job.startDate, job.endDate, job.currentlyWorking)}
            title={job.jobTitle}
            sub={joinNonEmpty([job.companyName, job.location, job.employeeType], ' | ')}
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
            date={project.projectType}
            title={joinNonEmpty([project.projectName, project.role], ' - ')}
            sub={project.projectUrl ? <a className="rbt-link" href={safeHref(project.projectUrl) ?? undefined}>{prettyUrl(project.projectUrl)}</a> : null}
          />,
          project.projectDescription,
          project.keyResponsibilities,
          project.keyAchievements,
        );
        const tech = (project.technologies ?? []).filter(has);
        return tech.length > 0 ? glue([...base, { id: `project-${index}-tech`, element: <p className="rbt-tech">Tech: {tech.join(', ')}</p> }]) : base;
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
            <div className="rbt-ref">
              <strong>{reference.name}</strong>
              <div className="rbt-entry-sub">{joinNonEmpty([reference.jobTitle, reference.company, reference.relationship])}</div>
              <div className="rbt-entry-sub">{joinNonEmpty([reference.email, reference.phone])}</div>
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
