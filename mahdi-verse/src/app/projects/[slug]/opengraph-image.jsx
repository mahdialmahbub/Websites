// src/app/projects/[slug]/opengraph-image.jsx
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import projectsData from '../../assets/projects/projects'

export const alt = 'Project case study preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const SITE_NAME = 'Your Name — Web Developer'
const BACKGROUND = '#0a0a0a'
const ACCENT = '#8b5cf6' // site er brand color diye replace koro

const truncate = (text = '', max) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text

function getTags(project) {
  const tags = project.tags?.length
    ? project.tags
    : [...(project.design?.tags ?? []), ...(project.development?.tags ?? [])]
  return [...new Set(tags)].slice(0, 3)
}

// Remote URL hole shoja use hoy, local (/projects/...) hole public folder theke porhe data URI banay
async function getCoverSrc(src) {
  if (!src) return null
  if (/^https?:\/\//i.test(src)) return src

  const ext = path.extname(src).slice(1).toLowerCase()
  const mime = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' }[ext]
  if (!mime) return null // webp ImageResponse e support kore na

  try {
    const file = await readFile(path.join(process.cwd(), 'public', src))
    return `data:${mime};base64,${file.toString('base64')}`
  } catch {
    return null
  }
}

// Build time e prottek project er image toiri hobe
export function generateStaticParams() {
  return projectsData.map(({ slug }) => ({ slug }))
}

export default async function Image({ params }) {
  const { slug } = await params
  const project = projectsData.find((p) => p.slug === slug)

  const title = truncate(project?.title ?? SITE_NAME, 80)
  const description = truncate(project?.description ?? '', 120)
  const tags = project ? getTags(project) : []
  const cover = await getCoverSrc(project?.finalDesign?.coverImage?.src)

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: BACKGROUND,
          color: '#ffffff',
          padding: 64,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
          }}
        >
          <div style={{ display: 'flex', fontSize: 28, color: '#a1a1aa' }}>{SITE_NAME}</div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: 'flex',
                    fontSize: 22,
                    padding: '8px 18px',
                    borderRadius: 999,
                    border: `1px solid ${ACCENT}`,
                    color: '#c4b5fd',
                    marginRight: 12,
                    marginBottom: 12,
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', fontSize: 56, lineHeight: 1.15, marginTop: 12 }}>
              {title}
            </div>
          </div>

          <div style={{ display: 'flex', fontSize: 26, lineHeight: 1.4, color: '#a1a1aa' }}>
            {description}
          </div>
        </div>

        {cover && (
          <div style={{ display: 'flex', marginLeft: 48 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt=""
              width={420}
              height={502}
              style={{ objectFit: 'cover', borderRadius: 24 }}
            />
          </div>
        )}
      </div>
    ),
    { ...size },
  )
}