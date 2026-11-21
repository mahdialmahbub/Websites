import { buildBlocks } from './blocks';
import demoData from './demoData';
import Page from './Page';
import './playful.css';

/**
 * Template definition. The registry (../registry.js) turns this object into a selectable template.
 * `id` must be the same as the `slug` in the database catalog.
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  id: 'playful', //             unique, lower-case, saved in resume.design.templateId
  name: 'Playful',
  category: 'Creative', //      one of TEMPLATE_CATEGORIES (registry.js) - used for filtering
  description: 'A friendly layout with a coloured contact band, a round photo and a light confetti pattern.',
  demoData, //                  complete sample resume for previews
  buildBlocks, //               data -> { sidebar: Block[], main: Block[] }
  Page, //                      one A4 page frame
};
