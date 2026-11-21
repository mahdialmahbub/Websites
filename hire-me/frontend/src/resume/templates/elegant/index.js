import { buildBlocks } from './blocks';
import demoData from './demoData';
import Page from './Page';
import './elegant.css';

/**
 * Template definition. The registry (../registry.js) turns this object into a selectable template.
 * `id` must be the same as the `slug` in the database catalog.
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  id: 'elegant', //             unique, lower-case, saved in resume.design.templateId
  name: 'Elegant',
  category: 'Simple', //        one of TEMPLATE_CATEGORIES (registry.js) - used for filtering
  description: 'A calm layout with a big serif name, a grey summary box and a thin dividing line. No photo.',
  demoData, //                  complete sample resume for previews
  buildBlocks, //               data -> { sidebar: Block[], main: Block[] }
  Page, //                      one A4 page frame
};
