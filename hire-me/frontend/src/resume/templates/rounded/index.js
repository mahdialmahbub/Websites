import { buildBlocks } from './blocks';
import demoData from './demoData';
import Page from './Page';
import './rounded.css';

/**
 * Template definition. The registry (../registry.js) turns this object into a selectable template.
 * `id` must be the same as the `slug` in the database catalog.
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  id: 'rounded', //             unique, lower-case, saved in resume.design.templateId
  name: 'Rounded',
  category: 'Student', //       one of TEMPLATE_CATEGORIES (registry.js) - used for filtering
  description: 'A friendly layout with a round photo, a coloured name banner, pill-shaped headings and grey content boxes.',
  demoData, //                  complete sample resume for previews
  buildBlocks, //               data -> { sidebar: Block[], main: Block[] }
  Page, //                      one A4 page frame
};
