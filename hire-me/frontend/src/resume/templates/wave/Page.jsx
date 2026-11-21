/**
 * ONE page. First page: a coloured header (photo, name, title, wave) on top of the two columns.
 * Other pages: columns only. The light sidebar background is on every page (.rwv-bg).
 * Both columns have data-column and fill the remaining height; their widths never change between pages.
 * Without a photo the header simply has no photo.
 */
export default function Page({ pageIndex, data, sidebar, main }) {
  const p = data.personalInformation ?? {};
  const first = pageIndex === 0;
  const photo = p.photo?.url;

  return (
    <div className={first ? 'rwv-page' : 'rwv-page rwv-later'}>
      <div className="rwv-bg" />

      {first ? (
        <header className="rwv-head">
          <div className="rwv-fill" />
          <svg className="rwv-wave" viewBox="0 0 794 56" preserveAspectRatio="none" width="100%" height="56" aria-hidden="true">
            <path className="rwv-wave-soft" d="M0 0 H794 V32 C 660 60 480 16 0 50 Z" />
            <path className="rwv-wave-main" d="M0 0 H794 V8 C 640 46 420 4 0 42 Z" />
          </svg>
          {photo ? <img className="rwv-photo" src={photo} alt="" /> : null}
          <div className={photo ? 'rwv-ident' : 'rwv-ident rwv-ident-nophoto'}>
            <h1 className="rwv-name">{p.fullName}</h1>
            {String(p.professionalTitle ?? '').trim() !== '' ? <p className="rwv-title">{p.professionalTitle}</p> : null}
          </div>
        </header>
      ) : null}

      <div className="rwv-cols">
        <aside className="rwv-side" data-column="sidebar">
          {sidebar}
        </aside>
        <section className="rwv-main" data-column="main">
          {main}
        </section>
      </div>
    </div>
  );
}
