import { glue, section } from '../../engine/blockKit';
import { dateRange, joinNonEmpty } from '../../lib/format';
import { textToBullets } from '../../lib/textToBullets';

const has = (value) => (Array.isArray(value) ? value.length > 0 : String(value ?? '').trim() !== '');
const heading = (id, title, side = false) => ({
  id,
  element: <h2 className={side ? 'rmd-heading rmd-heading-side' : 'rmd-heading'}>{title}</h2>,
});

/** Turn the resume data into blocks. Two columns: contact + skills go into `sidebar`, the rest into `main`. */
export function buildBlocks(data) {
  const p = data.personalInformation ?? {};
  const sidebar = [];
  const main = [];

  // ---------- main column ----------
  main.push({
    id: 'header',
    element: (
      <div className="rmd-header">
        <h1 className="rmd-name">{p.fullName}</h1>
        {has(p.professionalTitle) ? <p className="rmd-title">{p.professionalTitle}</p> : null}
      </div>
    ),
  });

  if (has(data.professionalSummary)) {
    main.push(...section(heading('summary-h', 'Profile'), [[{ id: 'summary', element: <p className="rmd-text">{data.professionalSummary}</p> }]]));
  }

  const jobs = (data.workExperience ?? []).filter((job) => has(job.jobTitle) || has(job.companyName));
  if (jobs.length > 0) {
    main.push(
      ...section(
        heading('experience-h', 'Experience'),
        jobs
          .map((job, index) => [
            {
              id: `job-${index}-head`,
              element: (
                <div className="rmd-job">
                  <div className="rmd-job-title">{job.jobTitle}</div>
                  <div className="rmd-job-meta">
                    <span className="rmd-company">{job.companyName}</span>
                    <span className="rmd-muted">{dateRange(job.startDate, job.endDate, job.currentlyWorking)}</span>
                  </div>
                </div>
              ),
            },
            // every sentence of the description = one bullet block (textToBullets)
            ...textToBullets(job.jobDescription).map((text, i) => ({
              id: `job-${index}-b${i}`,
              element: (
                <ul className="rmd-bullets">
                  <li>{text}</li>
                </ul>
              ),
            })),
          ])
          .map(glue), // glue = the entry stays together on one page
      ),
    );
  }

  // ---------- sidebar column ----------
  const contactLines = [p.email, p.phone, p.location].filter(has);
  if (contactLines.length > 0) {
    sidebar.push(
      ...section(heading('contact-h', 'Contact', true), [
        [
          {
            id: 'contact',
            element: (
              <ul className="rmd-list">
                {contactLines.map((line, i) => (
                  <li key={i}>{line}</li>
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
        heading('skills-h', 'Skills', true),
        skills.map((skill, index) => [{ id: `skill-${index}`, element: <p className="rmd-skill">{skill}</p> }]),
      ),
    );
  }

  return { sidebar, main };
}
