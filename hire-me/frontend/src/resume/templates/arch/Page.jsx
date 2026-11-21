/**
 * ONE page: a soft rounded sidebar (left, same on every page) + main column (right).
 * Photo and the big name are normal blocks, so they only appear where the engine puts them (page 1).
 * Both columns have data-column and fill the page height; their widths never change between pages.
 */
export default function Page({ sidebar, main }) {
  return (
    <div className="rar-page overflow-hidden">
      <aside className="rar-side" data-column="sidebar">
        {sidebar}
      </aside>
      <section className="rar-main" data-column="main">
        {main}
      </section>
    </div>
  );
}
