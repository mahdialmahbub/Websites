/**
 * One A4 page: main column on the left, dark sidebar on the right.
 * Both columns have data-column and fill the page height. Column widths are the same on every page.
 */
export default function Page({ sidebar, main }) {
  return (
    <div className="rtl-page">
      <div className="rtl-main" data-column="main">
        {main}
      </div>
      <div className="rtl-side" data-column="sidebar">
        {sidebar}
      </div>
    </div>
  );
}
