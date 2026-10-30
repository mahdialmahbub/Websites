/**
 * Structured data (JSON-LD) for search engines. "<" is escaped so catalog text can never close the script tag.
 */
export default function JsonLd({ data }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
