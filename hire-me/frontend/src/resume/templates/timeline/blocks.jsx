import { glue, section } from '../../engine/blockKit';
import { dateRange, joinNonEmpty, prettyUrl, safeHref } from '../../lib/format';
import { textToBullets } from '../../lib/textToBullets';

/*
 * TIMELINE
 * main    -> Name, Profile (coloured band), Work Experience, Education, Projects, References   (timeline style)
 * sidebar -> Photo, Contacts, Skills, Languages
 * Empty field / empty section -> no block at all.
 */

const has = (value) => (Array.isArray(value) ? value.length > 0 : String(value ?? '').trim() !== '');
const hasAny = (item, keys) => keys.some((key) => has(item?.[key]));

// kind: 'main' | 'band' | 'side' | 'side-first'
const heading = (id, title, kind = 'main') => ({
  id,
  element: <h2 className={`rtl-heading rtl-heading-${kind}`}>{title}</h2>,
});

// small icons (24x24 paths) shown in the contact circles
const ICONS = {
  phone: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
  email: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  location: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
};

function Icon({ name }) {
  if (name === 'web') {
    return (
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

const contactBlock = (id, icon, text) => ({
  id,
  element: (
    <div className="rtl-contact">
      <span className="rtl-ico">
        <Icon name={icon} />
      </span>
      <span className="rtl-contact-text">{text}</span>
    </div>
  ),
});

/**
 * One timeline entry: date tag + dot + vertical line run through every block of the entry.
 * `dates` can be empty (then only the dot and the line are shown).
 */
function timelineEntry(id, { dates, title, company, sub }, ...descriptions) {
  const bullets = descriptions.flatMap((text) => textToBullets(text));
  return glue([
    {
      id: `${id}-head`,
      element: (
        <div className="rtl-job">
          {has(dates) ? <span className="rtl-dates">{dates}</span> : null}
          <div className="rtl-job-title">{title}</div>
          {has(company) ? <div className="rtl-company">{company}</div> : null}
          {has(sub) ? <div className="rtl-sub">{sub}</div> : null}
        </div>
      ),
    },
    // every sentence of the description = one bullet block (textToBullets)
    ...bullets.map((text, i) => ({
      id: `${id}-b${i}`,
      element: (
        <div className="rtl-job-line">
          <ul className="rtl-bullets">
            <li>{text}</li>
          </ul>
        </div>
      ),
    })),
  ]);
}

// ───────── main column ─────────
function buildMain(data) {
  const p = data.personalInformation ?? {};
  const main = [];

  if (has(p.fullName) || has(p.professionalTitle)) {
    main.push({
      id: 'header',
      element: (
        <div className="rtl-header">
          <h1 className="rtl-name">{p.fullName}</h1>
          {has(p.professionalTitle) ? <p className="rtl-title">{p.professionalTitle}</p> : null}
        </div>
      ),
    });
  }

  if (has(data.professionalSummary)) {
    main.push(...section(heading('summary-h', 'Profile', 'band'), [[{ id: 'summary', element: <p className="rtl-band-text">{data.professionalSummary}</p> }]]));
  }

  const jobs = (data.workExperience ?? []).filter((job) => hasAny(job, ['companyName', 'jobTitle', 'jobDescription']));
  main.push(
    ...section(
      heading('experience-h', 'Work Experience'),
      jobs.map((job, index) =>
        timelineEntry(
          `job-${index}`,
          {
            dates: dateRange(job.startDate, job.endDate, job.currentlyWorking),
            title: has(job.jobTitle) ? job.jobTitle : job.companyName,
            company: has(job.jobTitle) ? job.companyName : '',
            sub: joinNonEmpty([job.location, job.employeeType], ' | '),
          },
          job.jobDescription,
        ),
      ),
    ),
  );

  const schools = (data.education ?? []).filter((school) => hasAny(school, ['institutionName', 'degree', 'fieldOfStudy']));
  main.push(
    ...section(
      heading('education-h', 'Education'),
      schools.map((school, index) => {
        const degree = joinNonEmpty([school.degree, school.fieldOfStudy], ' - ');
        return timelineEntry(
          `edu-${index}`,
          {
            dates: dateRange(school.startDate, school.endDate, school.currentlyStudying),
            title: degree || school.institutionName,
            company: degree ? school.institutionName : '',
            sub: has(school.gpa) ? `GPA ${school.gpa}` : '',
          },
          school.description,
        );
      }),
    ),
  );

  const projects = (data.projects ?? []).filter((project) => hasAny(project, ['projectName', 'projectDescription']));
  main.push(
    ...section(
      heading('projects-h', 'Projects'),
      projects.map((project, index) => {
        const base = timelineEntry(
          `project-${index}`,
          {
            title: joinNonEmpty([project.projectName, project.role], ' - '),
            company: project.projectUrl ? <a className="rtl-link" href={safeHref(project.projectUrl) ?? undefined}>{prettyUrl(project.projectUrl)}</a> : '',
            sub: project.projectType,
          },
          project.projectDescription,
          project.keyResponsibilities,
          project.keyAchievements,
        );
        const tech = (project.technologies ?? []).filter(has);
        // technologies line is the last block of the entry
        return tech.length > 0
          ? glue([...base, { id: `project-${index}-tech`, element: <div className="rtl-job-line"><p className="rtl-tech">Tech: {tech.join(', ')}</p></div> }])
          : base;
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
            <div className="rtl-ref">
              <strong>{reference.name}</strong>
              <div className="rtl-sub">{joinNonEmpty([reference.jobTitle, reference.company, reference.relationship])}</div>
              <div className="rtl-sub">{joinNonEmpty([reference.email, reference.phone])}</div>
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
    sidebar.push({ id: 'photo', element: <img className="rtl-photo" src={p.photo.url} alt="" /> });
  }
  // the first heading of the sidebar has no top padding (only when nothing is above it)
  const sideKind = () => (sidebar.length === 0 ? 'side-first' : 'side');

  const contacts = [
    [p.phone, 'phone', 'phone'],
    [p.email, 'email', 'email'],
    [p.location, 'location', 'location'],
    [has(p.linkedin) && prettyUrl(p.linkedin), 'web', 'linkedin'],
    [has(p.website) && prettyUrl(p.website), 'web', 'website'],
  ].filter(([value]) => has(value));
  if (contacts.length > 0) {
    sidebar.push(
      ...section(
        heading('contact-h', 'Contacts', sideKind()),
        contacts.map(([value, icon, key]) => [contactBlock(`contact-${key}`, icon, value)]),
      ),
    );
  }

  const skills = (data.skills ?? []).filter(has);
  if (skills.length > 0) {
    sidebar.push(
      ...section(
        heading('skills-h', 'Skills', sideKind()),
        skills.map((skill, index) => [{ id: `skill-${index}`, element: <div className="rtl-skill">{skill}</div> }]),
      ),
    );
  }

  const languages = (data.languages ?? []).filter((language) => has(language.name));
  if (languages.length > 0) {
    sidebar.push(
      ...section(
        heading('languages-h', 'Languages', sideKind()),
        languages.map((language, index) => [
          { id: `language-${index}`, element: <div className="rtl-skill">{joinNonEmpty([language.name, has(language.level) && `(${language.level})`], ' ')}</div> },
        ]),
      ),
    );
  }

  return sidebar;
}

/** Turn the resume data into blocks. Name, profile and experience go into `main`; contacts and skills into `sidebar`. */
export function buildBlocks(data) {
  return { sidebar: buildSidebar(data), main: buildMain(data) };
}
