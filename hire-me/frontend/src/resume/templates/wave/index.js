import { buildBlocks } from './blocks';
import demoData from './demoData';
import Page from './Page';
import './wave.css';

/**
 * Template definition. The registry (../registry.js) turns this object into a selectable template.
 * `id` must be the same as the `slug` in the database catalog.
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  id: 'wave', //                unique, lower-case, saved in resume.design.templateId
  name: 'Wave',
  category: 'Modern', //        one of TEMPLATE_CATEGORIES (registry.js) - used for filtering
  description: 'A coloured header with a soft wave, a round photo, a light sidebar and icons on the experience.',
  demoData, //                  complete sample resume for previews
  buildBlocks, //               data -> { sidebar: Block[], main: Block[] }
  Page, //                      one A4 page frame
};
