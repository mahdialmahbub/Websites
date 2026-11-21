import { buildBlocks } from './blocks';
import demoData from './demoData';
import Page from './Page';
import './classic-serif.css';

/**
 * Template definition. The registry (../registry.js) turns this object into a selectable template.
 * `id` must be the same as the `slug` in the database catalog.
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  id: 'classic-serif', //       unique, lower-case, saved in resume.design.templateId
  name: 'Classic Serif',
  category: 'Professional', //  one of TEMPLATE_CATEGORIES (registry.js) - used for filtering
  description: 'A traditional layout with a centred serif name, a ruled header and two columns. No photo.',
  demoData, //                  complete sample resume for previews
  buildBlocks, //               data -> { sidebar: Block[], main: Block[] }
  Page, //                      one A4 page frame
};
