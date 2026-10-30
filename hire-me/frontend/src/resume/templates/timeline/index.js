import { buildBlocks } from './blocks';
import demoData from './demoData';
import Page from './Page';
import './timeline.css';

/**
 * TIMELINE - main column (name, coloured profile band, experience on a timeline) + dark sidebar (contacts, skills).
 * Register it in templates/registry.js (one import + one array entry).
 * `id` must be the same as the `slug` in the database catalog.
 */
export default {
  id: 'timeline', //            unique, lower-case letters / numbers / dashes
  name: 'Timeline',
  category: 'Modern', //        must be one of TEMPLATE_CATEGORIES in registry.js
  description: 'A bold two-column layout with a coloured profile band, a work timeline and a dark sidebar.',
  demoData,
  buildBlocks,
  Page,
};
