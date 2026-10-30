import { buildBlocks } from './blocks';
import demoData from './demoData';
import Page from './Page';
import './minimal.css';

/**
 * MINIMAL - a plain, black-and-white single column: big light name, spaced uppercase headings with a rule,
 * company on the left, dates on the right, role in italics.
 * Register it in templates/registry.js (one import + one array entry).
 * `id` must be the same as the `slug` in the database catalog.
 */
export default {
  id: 'minimal', //             unique, lower-case letters / numbers / dashes
  name: 'Minimal',
  category: 'Simple', //        must be one of TEMPLATE_CATEGORIES in registry.js
  description: 'A clean single-column layout with a large name, spaced headings and thin rules.',
  demoData,
  buildBlocks,
  Page,
};
