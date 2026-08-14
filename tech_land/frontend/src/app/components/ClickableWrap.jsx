import Link from "next/link";

export default function ClickableWrap({ href, children }) {
  if (!href) return children;

  return (
    <Link href={href} className="contents">
      {children}
    </Link>
  );
}