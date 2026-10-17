import { buildBlocks } from './blocks';
import demoData from './demoData';
import Page from './Page';
import './professional.css';

/**
 * Template definition. The registry (../registry.js) turns this object into a selectable template.
 * See docs/HOW_TO_ADD_A_TEMPLATE.md.
 */
export default {
  id: 'professional', //        unique, lower-case, saved in resume.design.templateId
  name: 'Professional',
  category: 'Professional', //  one of TEMPLATE_CATEGORIES (registry.js) - used for filtering
  description: 'Two columns with a coloured sidebar. Clean and easy for recruiters and ATS to read.',
  demoData, //                 complete sample resume for previews
  buildBlocks, //              data -> { sidebar: Block[], main: Block[] }
  Page, //                     one A4 page frame
};
