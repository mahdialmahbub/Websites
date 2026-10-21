import Link from "next/link";
import { CATEGORIES } from "./categories";
import "./marquee.css";

function CategoryList({ items, hidden = false }) {
  return (
    <ul className="marquee-group" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item.slug} className="marquee-item">
          <Link
            href={`/products?category=${item.slug}`}
            tabIndex={hidden ? -1 : undefined}
            className="marquee-link"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function InfinityScroll({
  items = CATEGORIES,
  speed = 35, // second: joto kom, toto fast
  direction = "left", // "left" ba "right"
  pauseOnHover = true,
}) {
  return (
    <nav className="marquee-wrapper" aria-label="Shop by category">
      <div className="marquee-fade marquee-fade--left" aria-hidden="true" />
      <div className="marquee-fade marquee-fade--right" aria-hidden="true" />

      <div
        className={`marquee-track ${
          pauseOnHover ? "marquee-track--paused-on-hover" : ""
        }`}
        style={{
          "--marquee-duration": `${speed}s`,
          "--marquee-direction": direction === "right" ? "reverse" : "normal",
        }}
      >
        {/* Asol list: screen reader ar crawler eta-i dekhe */}
        <CategoryList items={items} />

        {/* Seamless loop er jonno duplicate, assistive tech theke hidden */}
        <CategoryList items={items} hidden />
      </div>
    </nav>
  );
}