/**
 * One page. REQUIRED: the root fills the page, and the column that holds blocks has data-column="main"
 * (or "sidebar") and fills the remaining height (flex: 1; min-height: 0).
 * Anything you want on EVERY page (top bar, footer, running header) goes here.
 */
export default function Page({ pageIndex, pageCount, data, main }) {
  return (
    <div className="rbs-page">
      <div className="rbs-topbar" />
      <div className="rbs-body" data-column="main">
        {main}
      </div>
      <footer className="rbs-footer">
        <span>{data.personalInformation?.fullName}</span>
        <span>Page {pageIndex + 1} of {pageCount}</span>
      </footer>
    </div>
  );
}
