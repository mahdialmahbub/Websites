/**
 * One A4 page: a coloured sidebar on the left and the main column on the right.
 * Both columns have data-column and fill the page height. Column widths are the same on every page.
 */
export default function Page({ sidebar, main }) {
  return (
    <div className="rmd-page">
      <div className="rmd-side" data-column="sidebar">
        {sidebar}
      </div>
      <div className="rmd-main" data-column="main">
        {main}
      </div>
    </div>
  );
}
