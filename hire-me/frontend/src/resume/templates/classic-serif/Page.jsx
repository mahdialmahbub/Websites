/**
 * ONE page. First page: centred name + title above the two columns. Other pages: columns only.
 * Both columns have data-column and fill the remaining height; their widths never change between pages.
 * This design has no photo, so the photo is never shown.
 */
export default function Page({ pageIndex, data, sidebar, main }) {
  const p = data.personalInformation ?? {};
  const first = pageIndex === 0;

  return (
    <div className={first ? 'rcs-page' : 'rcs-page rcs-later'}>
      {first ? (
        <header className="rcs-head">
          <h1 className="rcs-name">{p.fullName}</h1>
          {String(p.professionalTitle ?? '').trim() !== '' ? <p className="rcs-title">{p.professionalTitle}</p> : null}
        </header>
      ) : null}

      <div className="rcs-cols">
        <aside className="rcs-side" data-column="sidebar">
          {sidebar}
        </aside>
        <section className="rcs-main" data-column="main">
          {main}
        </section>
      </div>
    </div>
  );
}
