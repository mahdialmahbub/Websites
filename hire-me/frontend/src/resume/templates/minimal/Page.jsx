/**
 * One A4 page, single column. The root fills the page and the column that holds blocks
 * has data-column="main" and fills the remaining height.
 */
export default function Page({ main }) {
  return (
    <div className="rmn-page">
      <div className="rmn-body" data-column="main">
        {main}
      </div>
    </div>
  );
}
