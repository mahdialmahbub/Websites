/**
 * ONE page of the template. The engine calls it once per page with that page's blocks.
 * Everything that must repeat on every page (sidebar background, footer, running header) lives here.
 *
 * REQUIRED by the engine:
 *   - the root fills the page (height: 100%)
 *   - every column that holds blocks has  data-column="sidebar"  or  data-column="main"
 *     and fills the remaining height (flex: 1; min-height: 0) - the engine measures it to know how much fits.
 *   - the column widths do not change between pages
 */
export default function Page({ pageIndex, pageCount, data, sidebar, main }) {
  const name = data.personalInformation?.fullName ?? '';

  return (
    <div className="rbp-page">
      <aside className="rbp-sidebar" data-column="sidebar">
        {sidebar}
      </aside>

      <section className="rbp-main">
        {/* pages 2, 3 ... get a small running header instead of the big name block */}
        {pageIndex > 0 ? <div className="rbp-running-header">{name}</div> : null}
        <div className="rbp-main-body" data-column="main">
          {main}
        </div>
        <footer className="rbp-footer">
          <span>{name}</span>
          <span>
            Page {pageIndex + 1} of {pageCount}
          </span>
        </footer>
      </section>
    </div>
  );
}
