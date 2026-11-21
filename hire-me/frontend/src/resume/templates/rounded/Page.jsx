/**
 * ONE page. First page: round photo + coloured name banner on top of the two columns.
 * Other pages: columns only. Both columns have data-column and fill the remaining height;
 * their widths never change between pages. Without a photo the banner simply has no photo.
 */
export default function Page({ pageIndex, data, sidebar, main }) {
  const p = data.personalInformation ?? {};
  const first = pageIndex === 0;
  const photo = p.photo?.url;

  return (
    <div className={first ? 'rrd-page' : 'rrd-page rrd-later'}>
      {first ? (
        <header className={photo ? 'rrd-head' : 'rrd-head rrd-head-nophoto'}>
          {photo ? <div className="rrd-tab" /> : null}
          <div className="rrd-banner">
            <h1 className="rrd-name">{p.fullName}</h1>
            {String(p.professionalTitle ?? '').trim() !== '' ? <p className="rrd-title">{p.professionalTitle}</p> : null}
          </div>
          {photo ? <img className="rrd-photo" src={photo} alt="" /> : null}
        </header>
      ) : null}

      <div className="rrd-cols">
        <aside className="rrd-side" data-column="sidebar">
          {sidebar}
        </aside>
        <section className="rrd-main" data-column="main">
          {main}
        </section>
      </div>
    </div>
  );
}
