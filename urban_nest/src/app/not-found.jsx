import Link from "next/link";
import SegmentDigits from "./Components/SegmentDigits";
import Button from "./Components/Button";

export default function NotFound() {
  return (
    <main className={"page"}>
      <SegmentDigits
        text="404"
        digitWidth={80}
        digitHeight={130}
        thickness={20}
        gap={36}
      />

      <h1
        className={
          "mt-space-5 font-medium leading-tight tracking-tight text-[32px]"
        }
      >
        Page not found
      </h1>
      <p className={"text text-placeholder"}>
        The page you are looking for does not exist or has been moved.
      </p>

      <Link href="/" className="mt-space-6">
        <Button text="Back to home" type="primary" className="hero-button" />
      </Link>
    </main>
  );
}
