import { glue, section } from '../../engine/blockKit';
import { dateRange, joinNonEmpty } from '../../lib/format';
import { textToBullets } from '../../lib/textToBullets';

const has = (value) => (Array.isArray(value) ? value.length > 0 : String(value ?? '').trim() !== '');
const heading = (id, title) => ({ id, element: <h2 className="rbs-heading">{title}</h2> });

/** Turn the resume data into blocks. Single column: everything goes into `main`, `sidebar` stays empty. */
export function buildBlocks(data) {
  const p = data.personalInformation ?? {};
  const main = [];

  main.push({
    id: 'header',
    element: (
      <div>
        <h1 className="rbs-name">{p.fullName}</h1>
        {has(p.professionalTitle) ? <p className="rbs-title">{p.professionalTitle}</p> : null}
        <p className="rbs-contact">{joinNonEmpty([p.email, p.phone, p.location])}</p>
      </div>
    ),
  });

  if (has(data.professionalSummary)) {
    main.push(...section(heading('summary-h', 'Summary'), [[{ id: 'summary', element: <p className="rbs-text">{data.professionalSummary}</p> }]]));
  }

  const jobs = (data.workExperience ?? []).filter((job) => has(job.jobTitle) || has(job.companyName));
  main.push(
    ...section(
      heading('experience-h', 'Experience'),
      jobs.map((job, index) => [
        {
          id: `job-${index}-head`,
          element: (
            <div className="rbs-row">
              <span>{joinNonEmpty([job.jobTitle, job.companyName], ' - ')}</span>
              <span className="rbs-muted">{dateRange(job.startDate, job.endDate, job.currentlyWorking)}</span>
            </div>
          ),
        },
        // every sentence of the description = one bullet block (textToBullets)
        ...textToBullets(job.jobDescription).map((text, i) => ({ id: `job-${index}-b${i}`, element: <ul className="rbs-bullets"><li>{text}</li></ul> })),
      ]).map(glue), // glue = the entry stays together on one page
    ),
  );

  if (has(data.skills)) {
    main.push(...section(heading('skills-h', 'Skills'), [[{ id: 'skills', element: <p className="rbs-text">{data.skills.join('  |  ')}</p> }]]));
  }

  return { sidebar: [], main };
}
