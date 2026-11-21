import { buildBlocks } from './blocks';
import demoData from './demoData';
import Page from './Page';
import './arch.css';

/**
 * Template definition. The registry (../registry.js) turns this object into a selectable template.
 * `id` must be the same as the `slug` in the database catalog.
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  id: 'arch', //                unique, lower-case, saved in resume.design.templateId
  name: 'Arch',
  category: 'Simple', //        one of TEMPLATE_CATEGORIES (registry.js) - used for filtering
  description: 'A soft rounded sidebar with a round photo, a large name and plenty of white space.',
  demoData, //                  complete sample resume for previews
  buildBlocks, //               data -> { sidebar: Block[], main: Block[] }
  Page, //                      one A4 page frame
};
