/**
 * ONE page: dark sidebar (left, same on every page) + main column (right).
 * First page only: a name banner (photo + name) that sits on top of both columns. Both columns
 * start lower on that page (see .rex-first in the CSS) so no block is hidden behind the banner.
 * Both columns have data-column and fill the page height; their widths never change between pages.
 */
export default function Page({ pageIndex, data, sidebar, main }) {
  const p = data.personalInformation ?? {};
  const first = pageIndex === 0;

  return (
    <div className={`${first ? 'rex-page rex-first' : 'rex-page'} overflow-hidden`}>
      <aside className="rex-side" data-column="sidebar">
        {sidebar}
      </aside>
      <section className="rex-main" data-column="main">
        {main}
      </section>

      {first ? (
        <header className="rex-head">
          {p.photo?.url ? <img className="rex-photo" src={p.photo.url} alt="" /> : null}
          <div className="rex-ident">
            <h1 className="rex-name">{p.fullName}</h1>
            {String(p.professionalTitle ?? '').trim() !== '' ? <p className="rex-title">{p.professionalTitle}</p> : null}
          </div>
        </header>
      ) : null}
    </div>
  );
}
