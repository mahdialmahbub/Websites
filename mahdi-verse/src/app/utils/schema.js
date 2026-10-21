// src/app/utils/schema.js
import { SITE_URL, canonical } from '@/src/app/utils/buildMetadata'
import { assets, contactPageInfo } from '@/src/app/assets/assets'

// ---- Nijer info diye replace koro ----
const PERSON = {
  name: 'Mahdi Al Mahbub',
  jobTitle: 'UI UX Designer and MERN Stack Developer',
  description: 'MERN stack developer and UI/UX designer building fast, SEO-friendly websites with Next.js. Web design, development, and technical SEO services.',
  // Verified profile URLs. For the same site, these win over the links in assets.js
  sameAs: [
    'https://github.com/mahdialmahbub',
    'https://www.linkedin.com/in/mahdi-al-mahbub',
  ],
  knowsAbout: ['Next.js', 'React', 'Node.js', 'MongoDB', 'Express.js', 'UI UX Design', 'SEO'],
  // Contact details: output on the contact page only
  email: 'mahdiallmahbub@gmail.com',
  phone: '+8801735999190',
  address: { '@type': 'PostalAddress', addressLocality: 'Gazipur', addressCountry: 'BD' },
}
const PROFILE_MODIFIED = '2026-10-20' // about page er content bodlale date update koro
// --------------------------------------

const { title: CONTACT_TITLE, socialLinks } = contactPageInfo

const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

// Other profiles from assets.js (Facebook, Behance, ...). Skipped: the email card,
// the WhatsApp link (not profile pages) and any site already listed in PERSON.sameAs
const knownHosts = new Set(PERSON.sameAs.map(hostOf))
const assetProfiles = socialLinks
  .map(({ userName }) => userName)
  .filter(
    (url) =>
      url.startsWith('https://') && !url.includes('wa.me') && !knownHosts.has(hostOf(url)),
  )

const SAME_AS = [...PERSON.sameAs, ...assetProfiles]

const PERSON_ID = `${SITE_URL}/#person`
const WEBSITE_ID = `${SITE_URL}/#website`
const ASCENDING = 'https://schema.org/ItemListOrderAscending'

const abs = (src) => new URL(src, SITE_URL).toString()
const withContext = (graph) => ({ '@context': 'https://schema.org', '@graph': graph })

/** Contact details are included only where they are visible: the contact page. */
function personSchema({ withContact = false } = {}) {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: PERSON.name,
    jobTitle: PERSON.jobTitle,
    description: PERSON.description,
    url: canonical('/'),
    image: abs(assets.profile.src),
    sameAs: SAME_AS,
    knowsAbout: PERSON.knowsAbout,
    ...(withContact && {
      email: PERSON.email,
      telephone: PERSON.phone,
      address: PERSON.address,
    }),
  }
}

function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: PERSON.name,
    url: canonical('/'),
    inLanguage: 'en',
    publisher: { '@id': PERSON_ID },
  }
}

function getTags(project) {
  const tags = project.tags?.length
    ? project.tags
    : [...(project.design?.tags ?? []), ...(project.development?.tags ?? [])]
  return [...new Set(tags)]
}

/** Home page er jonno: Person + WebSite */
export function homeSchema() {
  return withContext([personSchema(), websiteSchema()])
}

/** About page er jonno: ProfilePage (mainEntity = tumi) */
export function profilePageSchema(path = '/about') {
  return withContext([
    {
      '@type': 'ProfilePage',
      '@id': `${canonical(path)}#profile`,
      url: canonical(path),
      name: `About ${PERSON.name}`,
      dateModified: PROFILE_MODIFIED,
      isPartOf: { '@id': WEBSITE_ID },
      mainEntity: { '@id': PERSON_ID },
    },
    personSchema(),
  ])
}

/** Project page er jonno: projectsData er ekta project dao */
export function projectSchema(project) {
  const url = canonical(`/projects/${project.slug}`)
  const cover = project.finalDesign?.coverImage?.src
  const tags = getTags(project)

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${url}#project`,
    name: project.title,
    description: project.description,
    url,
    mainEntityOfPage: url,
    inLanguage: 'en',
    image: cover ? abs(cover) : undefined,
    keywords: tags.length ? tags.join(', ') : undefined,
    dateModified: project.updatedAt ? new Date(project.updatedAt).toISOString() : undefined,
    creator: {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: PERSON.name,
      url: canonical('/'),
    },
  }
}

/** Contact page: the name is the page heading from contactPageInfo */
export function contactPageSchema(path = '/contact') {
  return withContext([
    {
      '@type': 'ContactPage',
      '@id': `${canonical(path)}#page`,
      url: canonical(path),
      name: CONTACT_TITLE,
      description: `Get in touch with ${PERSON.name} for Development and UI/UX design projects.`,
      isPartOf: { '@id': WEBSITE_ID },
      mainEntity: { '@id': PERSON_ID },
    },
    personSchema({ withContact: true }),
  ])
}

/**
 * @typedef {Object} WorkflowPoint
 * @property {string} title
 * @property {string} description
 */

/**
 * @typedef {Object} WorkflowStep
 * @property {string} title
 * @property {string} [tagline]
 * @property {string} [description]
 * @property {WorkflowPoint[]} [points]
 */

/**
 * @typedef {Object} Process
 * @property {string} name - Process er naam, jemon 'My UI/UX Design Process'
 * @property {string} [description]
 * @property {WorkflowStep[]} steps - UIUXWorkflow ba MERNStackWorkflow
 */

/**
 * Workflow page: prottek process ekta ItemList, prottek phase tar points er nested list
 * @param {Process[]} processes
 */
export function workflowPageSchema(processes, path = '/workflow') {
  const lists = processes.map(({ name, description, steps }) => ({
    '@type': 'ItemList',
    name,
    description,
    itemListOrder: ASCENDING,
    numberOfItems: steps.length,
    itemListElement: steps.map((step, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: step.title,
      // Each phase is itself a list of activities
      item: {
        '@type': 'ItemList',
        name: step.title,
        description: step.description,
        disambiguatingDescription: step.tagline,
        itemListOrder: ASCENDING,
        numberOfItems: step.points?.length,
        itemListElement: step.points?.map((point, j) => ({
          '@type': 'ListItem',
          position: j + 1,
          name: point.title,
          description: point.description,
        })),
      },
    })),
  }))

  return withContext([
    {
      '@type': 'WebPage',
      '@id': `${canonical(path)}#page`,
      url: canonical(path),
      name: `How ${PERSON.name} Works`,
      description: `The design and development process ${PERSON.name} follows, step by step.`,
      isPartOf: { '@id': WEBSITE_ID },
      hasPart: lists,
    },
  ])
}

/**
 * @typedef {Object} ListEntry
 * @property {string} name - Item er naam, jemon project er title
 * @property {string} path - Item er page path, jemon '/projects/my-project'
 */

/**
 * Client page. Page e project list dekhale `items` e dao, na dekhale khali rakho.
 * @param {{ path?: string, items?: ListEntry[] }} [options]
 */
export function clientsPageSchema({ path = '/client', items = [] } = {}) {
  return withContext([
    {
      '@type': 'CollectionPage',
      '@id': `${canonical(path)}#page`,
      url: canonical(path),
      name: `Clients of ${PERSON.name}`,
      description: `Clients ${PERSON.name} has worked with, and what they say about the work.`,
      isPartOf: { '@id': WEBSITE_ID },
      ...(items.length > 0 && {
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: items.length,
          itemListElement: items.map(({ name, path: itemPath }, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name,
            url: canonical(itemPath),
          })),
        },
      }),
    },
  ])
}

/**
 * Projects list page: CollectionPage + ItemList
 * @param {Array<{ slug: string, title: string }>} projects - Page e ja dekhacche
 */
export function projectsPageSchema(projects, path = '/projects') {
  return withContext([
    {
      '@type': 'CollectionPage',
      '@id': `${canonical(path)}#page`,
      url: canonical(path),
      name: `Projects by ${PERSON.name}`,
      description: `UI/UX design and full stack development projects by ${PERSON.name}.`,
      isPartOf: { '@id': WEBSITE_ID },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: projects.length,
        itemListElement: projects.map(({ slug, title }, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: title,
          url: canonical(`/projects/${slug}`),
        })),
      },
    },
  ])
}