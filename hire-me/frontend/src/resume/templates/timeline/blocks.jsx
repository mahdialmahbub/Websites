import { glue, section } from '../../engine/blockKit';
import { dateRange } from '../../lib/format';
import { textToBullets } from '../../lib/textToBullets';

const has = (value) => (Array.isArray(value) ? value.length > 0 : String(value ?? '').trim() !== '');

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

const contactBlock = (id, icon, text) => ({
  id,
  element: (
    <div className="rtl-contact">
      <span className="rtl-ico">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
          <path d={ICONS[icon]} />
        </svg>
      </span>
      <span className="rtl-contact-text">{text}</span>
    </div>
  ),
});

/** Turn the resume data into blocks. Name, profile and experience go into `main`; contacts and skills into `sidebar`. */
export function buildBlocks(data) {
  const p = data.personalInformation ?? {};
  const sidebar = [];
  const main = [];

  // ---------- main column ----------
  main.push({
    id: 'header',
    element: (
      <div className="rtl-header">
        <h1 className="rtl-name">{p.fullName}</h1>
        {has(p.professionalTitle) ? <p className="rtl-title">{p.professionalTitle}</p> : null}
      </div>
    ),
  });

  if (has(data.professionalSummary)) {
    main.push(...section(heading('summary-h', 'Profile', 'band'), [[{ id: 'summary', element: <p className="rtl-band-text">{data.professionalSummary}</p> }]]));
  }

  const jobs = (data.workExperience ?? []).filter((job) => has(job.jobTitle) || has(job.companyName));
  if (jobs.length > 0) {
    main.push(
      ...section(
        heading('experience-h', 'Work Experience'),
        jobs
          .map((job, index) => [
            {
              id: `job-${index}-head`,
              element: (
                <div className="rtl-job">
                  <span className="rtl-dates">{dateRange(job.startDate, job.endDate, job.currentlyWorking)}</span>
                  <div className="rtl-job-title">{has(job.jobTitle) ? job.jobTitle : job.companyName}</div>
                  {has(job.jobTitle) && has(job.companyName) ? <div className="rtl-company">{job.companyName}</div> : null}
                </div>
              ),
            },
            // every sentence of the description = one bullet block (textToBullets)
            ...textToBullets(job.jobDescription).map((text, i) => ({
              id: `job-${index}-b${i}`,
              element: (
                <div className="rtl-job-line">
                  <ul className="rtl-bullets">
                    <li>{text}</li>
                  </ul>
                </div>
              ),
            })),
          ])
          .map(glue), // glue = the entry stays together on one page
      ),
    );
  }

  // ---------- sidebar column ----------
  const contacts = [
    [p.phone, 'phone', 'phone'],
    [p.email, 'email', 'email'],
    [p.location, 'location', 'location'],
  ].filter(([value]) => has(value));
  if (contacts.length > 0) {
    sidebar.push(
      ...section(
        heading('contact-h', 'Contacts', 'side-first'),
        contacts.map(([value, icon, key]) => [contactBlock(`contact-${key}`, icon, value)]),
      ),
    );
  }

  const skills = (data.skills ?? []).filter(has);
  if (skills.length > 0) {
    sidebar.push(
      ...section(
        heading('skills-h', 'Skills', sidebar.length === 0 ? 'side-first' : 'side'),
        skills.map((skill, index) => [{ id: `skill-${index}`, element: <div className="rtl-skill">{skill}</div> }]),
      ),
    );
  }

  return { sidebar, main };
}
