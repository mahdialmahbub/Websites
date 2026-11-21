/**
 * ONE page: coloured sidebar (left, same on every page) + main column (right).
 * Photo and the big name block are normal blocks, so they only appear where the engine puts them (page 1).
 * Both columns have data-column and fill the page height; their widths never change between pages.
 */
export default function Page({ sidebar, main }) {
  return (
    <div className="rbt-page overflow-hidden">
      <aside className="rbt-side" data-column="sidebar">
        {sidebar}
      </aside>
      <section className="rbt-main" data-column="main">
        {main}
      </section>
    </div>
  );
}
