# Phase 2 - templates listing, category filter, SEO

Copy the files of this zip into `hire-me/frontend/` (same paths). Backend: Phase 1 must be running + `npm run seed`.

## Routes
| URL | What |
|---|---|
| `/templates` | all templates, `?page=2` for more (server-rendered) |
| `/templates/category/<slug>` | one category (the filter is the URL), `?page=2` |
| `/templates/<slug>` | one template: big preview, "Use this template", related templates |
| `/sitemap.xml`, `/robots.txt` | generated (templates + category pages, rebuilt hourly) |

"Use This" opens `/builder?template=<slug>`. Nothing is saved until the first save in the builder (Phase 3 reads that query).
`category` is a reserved word: no template can have the slug `category`.

## Environment (`.env.local`)
```
BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000     # production: https://your-domain.com (no trailing slash)
```

## Changed existing files
- `src/app/layout.js`: real site title/description, `metadataBase`, title template `%s | HireMe`.
- `src/app/components/home/Templetes.jsx`: now a server component with real templates + category links (the static placeholder card and fake filter are gone). If the API is down the section shows only its call-to-action.

## Added
- `src/resume/**`: the milestone-3 resume engine (needed for the template thumbnails; Phase 3 uses the rest of it).
- `src/lib/site.js`, `src/lib/catalog.js` (server-side API access + URL helpers).
- `src/app/templates/**`, `src/app/components/templates/*`, `src/app/components/JsonLd.jsx`, `src/app/sitemap.js`, `src/app/robots.js`.

## SEO checklist (all verified on the rendered HTML)
unique `<title>` + meta description per page (page 2 says "Page 2"), canonical URL, `rel=prev/next`, Open Graph + Twitter tags,
JSON-LD (CollectionPage + BreadcrumbList + ItemList; WebPage + BreadcrumbList on a template), one `<h1>` per page,
breadcrumbs, crawlable `<a>` links for categories and pages, `aria-label` text for every preview, unknown category/page -> real 404.

## Known gaps
- No `og:image` yet (there is no image to point to; the thumbnails are drawn live in the browser). Add `src/app/opengraph-image.jpg` for a default one.
- A template that an admin adds to the catalog but that has no design folder in `src/resume/templates/` shows the default design.
- **Linux/Vercel build will fail on `assets/Icons` vs `./icons/...` imports** (it works on Windows/macOS because they ignore case). Rename the folder with `git mv assets/Icons assets/icons-tmp && git mv assets/icons-tmp assets/icons`.
