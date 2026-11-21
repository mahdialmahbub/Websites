/**
 * ONE page: left column (name, contact, education, skills) | thin line | right column (summary box, experience).
 * Both columns have data-column and fill the page height; their widths never change between pages.
 * This design has no photo, so the photo is never shown.
 */
export default function Page({ sidebar, main }) {
  return (
    <div className="rel-page">
      <aside className="rel-side" data-column="sidebar">
        {sidebar}
      </aside>
      <section className="rel-main" data-column="main">
        {main}
      </section>
    </div>
  );
}
