import { buildBlocks } from './blocks';
import demoData from './demoData';
import Page from './Page';
import './starter.css';

/**
 * STARTER - copy this folder, rename it, then register it in templates/registry.js (one import + one array entry).
 * It is NOT registered, so it does not show up in the app.
 */
export default {
  id: 'starter', //             unique, lower-case letters / numbers / dashes
  name: 'Starter',
  category: 'Simple', //        must be one of TEMPLATE_CATEGORIES in registry.js
  description: 'A plain single-column layout to copy when you create a new template.',
  demoData,
  buildBlocks,
  Page,
};
