import { glue, section } from '../../engine/blockKit';
import { dateRange, joinNonEmpty, prettyUrl, safeHref } from '../../lib/format';
import { textToBullets } from '../../lib/textToBullets';

/*
 * ROUNDED (photo + name banner are drawn by Page.jsx on the first page)
 * sidebar (left) -> Contact, Expertise (skills), Language, Reference
 * main (right)   -> About Me, Education, Experience, Projects   (entries sit in grey boxes)
 * Empty field / empty section -> no block at all.
 */

const has = (value) => (Array.isArray(value) ? value.length > 0 : String(value ?? '').trim() !== '');
const hasAny = (item, keys) => keys.some((key) => has(item?.[key]));

// pill heading: wrapper gives the space above, the pill itself is the coloured shape
const heading = (id, title, side = false) => ({
  id,
  element: (
    <div className="rrd-hwrap">
      <h2 className={side ? 'rrd-pill rrd-pill-side' : 'rrd-pill'}>{title}</h2>
    </div>
  ),
});

/**
 * Entry inside a grey box: head block + one block per bullet, glued together.
 * The LAST block of the entry gets `rrd-box-last` (bottom padding), so neighbouring entries
 * look like one continuous grey box.
 */
function boxEntry(id, { title, date, sub }, ...descriptions) {
  const bullets = descriptions.flatMap((text) => textToBullets(text));
  const lastIndex = bullets.length - 1;
  return glue([
    {
      id: `${id}-head`,
      element: (
        <div className={bullets.length === 0 ? 'rrd-box rrd-box-head rrd-box-last' : 'rrd-box rrd-box-head'}>
          <div className="rrd-box-title">{joinNonEmpty([title, date], '  ')}</div>
          {has(sub) ? <div className="rrd-box-sub">{sub}</div> : null}
        </div>
      ),
    },
    ...bullets.map((text, index) => ({
      id: `${id}-b${index}`,
      element: (
        <div className={index === lastIndex ? 'rrd-box rrd-box-b rrd-box-last' : 'rrd-box rrd-box-b'}>
          <ul className="rrd-bullets">
            <li>{text}</li>
          </ul>
        </div>
      ),
    })),
  ]);
}

// ───────── left column (sidebar) ─────────
function buildSidebar(data) {
  const p = data.personalInformation ?? {};
  const blocks = [];

  const contact = [
    has(p.phone) && { key: 'phone', label: 'Phone', value: p.phone },
    has(p.email) && { key: 'email', label: 'Email', value: p.email, href: `mailto:${p.email}` },
    has(p.location) && { key: 'location', label: 'Address', value: p.location },
    has(p.linkedin) && { key: 'linkedin', label: 'LinkedIn', value: prettyUrl(p.linkedin), href: safeHref(p.linkedin) },
    has(p.website) && { key: 'website', label: 'Website', value: prettyUrl(p.website), href: safeHref(p.website) },
  ].filter(Boolean);
  if (contact.length > 0) {
    blocks.push(
      ...section(
        heading('contact-h', 'Contact', true),
        contact.map(({ key, label, value, href }) => [
          {
            id: `contact-${key}`,
            element: (
              <div className="rrd-side-pad rrd-contact">
                <div className="rrd-contact-label">{label}</div>
                <div className="rrd-contact-value">{href ? <a className="rrd-link-plain" href={href}>{value}</a> : value}</div>
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
      ...section(heading('skills-h', 'Expertise', true), [
        [
          {
            id: 'skills',
            element: (
              <ul className="rrd-side-pad rrd-dots">
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
      ...section(
        heading('languages-h', 'Language', true),
        languages.map((language, index) => [
          {
            id: `language-${index}`,
            element: (
              <div className="rrd-side-pad rrd-lang">
                <span>{language.name}</span>
                {has(language.level) ? <span className="rrd-lang-level">{language.level}</span> : null}
              </div>
            ),
          },
        ]),
      ),
    );
  }

  const references = (data.references ?? []).filter((reference) => hasAny(reference, ['name', 'company']));
  blocks.push(
    ...section(
      heading('references-h', 'Reference', true),
      references.map((reference, index) => [
        {
          id: `ref-${index}`,
          element: (
            <div className="rrd-side-pad rrd-ref">
              <strong>{reference.name}</strong>
              <div className="rrd-ref-sub">{joinNonEmpty([reference.jobTitle, reference.company, reference.relationship])}</div>
              <div className="rrd-ref-sub">{joinNonEmpty([reference.email, reference.phone])}</div>
            </div>
          ),
        },
      ]),
    ),
  );

  return blocks;
}

// ───────── right column (main) ─────────
function buildMain(data) {
  const blocks = [];

  if (has(data.professionalSummary)) {
    blocks.push(...section(heading('summary-h', 'About Me'), [[{ id: 'summary', element: <p className="rrd-paragraph">{data.professionalSummary}</p> }]]));
  }

  const schools = (data.education ?? []).filter((school) => hasAny(school, ['institutionName', 'degree', 'fieldOfStudy']));
  blocks.push(
    ...section(
      heading('education-h', 'Education'),
      schools.map((school, index) =>
        boxEntry(
          `edu-${index}`,
          {
            title: has(school.institutionName) ? school.institutionName : joinNonEmpty([school.degree, school.fieldOfStudy], ', '),
            date: dateRange(school.startDate, school.endDate, school.currentlyStudying),
            sub: joinNonEmpty([has(school.institutionName) ? joinNonEmpty([school.degree, school.fieldOfStudy], ', ') : '', has(school.gpa) && `GPA ${school.gpa}`], ' | '),
          },
          school.description,
        ),
      ),
    ),
  );

  const jobs = (data.workExperience ?? []).filter((job) => hasAny(job, ['companyName', 'jobTitle', 'jobDescription']));
  blocks.push(
    ...section(
      heading('experience-h', 'Experience'),
      jobs.map((job, index) =>
        boxEntry(
          `job-${index}`,
          {
            title: has(job.companyName) ? job.companyName : job.jobTitle,
            date: dateRange(job.startDate, job.endDate, job.currentlyWorking),
            sub: joinNonEmpty([has(job.companyName) ? job.jobTitle : '', job.location, job.employeeType], ' | '),
          },
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
        const base = boxEntry(
          `project-${index}`,
          {
            title: joinNonEmpty([project.projectName, project.role], ' - '),
            date: project.projectType,
            sub: project.projectUrl ? prettyUrl(project.projectUrl) : '',
          },
          project.projectDescription,
          project.keyResponsibilities,
          project.keyAchievements,
        );
        const tech = (project.technologies ?? []).filter(has);
        // technologies line is the last block of the entry
        return tech.length > 0 ? glue([...base, { id: `project-${index}-tech`, element: <p className="rrd-box rrd-box-last rrd-tech">Tech: {tech.join(', ')}</p> }]) : base;
      }),
    ),
  );

  return blocks;
}

export function buildBlocks(data) {
  return { sidebar: buildSidebar(data), main: buildMain(data) };
}
