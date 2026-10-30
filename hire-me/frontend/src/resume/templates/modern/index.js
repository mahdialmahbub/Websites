import { buildBlocks } from './blocks';
import demoData from './demoData';
import Page from './Page';
import './modern.css';

/**
 * MODERN - two columns: a coloured sidebar (contact, skills) and a clean main column (summary, experience).
 * Register it in templates/registry.js (one import + one array entry).
 * `id` must be the same as the `slug` in the database catalog.
 */
export default {
  id: 'modern', //              unique, lower-case letters / numbers / dashes
  name: 'Modern',
  category: 'Modern', //        must be one of TEMPLATE_CATEGORIES in registry.js
  description: 'A clean two-column layout with a coloured sidebar for contact details and skills.',
  demoData,
  buildBlocks,
  Page,
};
