// src/app/components/JsonLd.jsx

/**
 * Page e JSON-LD script boshay.
 * @param {{ data: Record<string, unknown> }} props - schema.js er kono function er output
 */
export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      // "<" escape kora hoy, jate data er bhetore "</script>" thakleo page vange na
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}