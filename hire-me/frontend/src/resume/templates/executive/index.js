import { buildBlocks } from './blocks';
import demoData from './demoData';
import Page from './Page';
import './executive.css';

/**
 * Template definition. The registry (../registry.js) turns this object into a selectable template.
 * `id` must be the same as the `slug` in the database catalog.
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  id: 'executive', //           unique, lower-case, saved in resume.design.templateId
  name: 'Executive',
  category: 'Professional', //  one of TEMPLATE_CATEGORIES (registry.js) - used for filtering
  description: 'A dark sidebar, a wide name banner with a round photo and a work timeline with date tags.',
  demoData, //                  complete sample resume for previews
  buildBlocks, //               data -> { sidebar: Block[], main: Block[] }
  Page, //                      one A4 page frame
};
