import { buildBlocks } from './blocks';
import demoData from './demoData';
import Page from './Page';
import './bold-teal.css';

/**
 * Template definition. The registry (../registry.js) turns this object into a selectable template.
 * `id` must be the same as the `slug` in the database catalog.
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  id: 'bold-teal', //           unique, lower-case, saved in resume.design.templateId
  name: 'Bold Teal',
  category: 'Modern', //        one of TEMPLATE_CATEGORIES (registry.js) - used for filtering
  description: 'A strong coloured sidebar with a round photo, a big name block and centred section headings.',
  demoData, //                  complete sample resume for previews
  buildBlocks, //               data -> { sidebar: Block[], main: Block[] }
  Page, //                      one A4 page frame
};
