import Link from "next/link";
import Button from "./components/Button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen pt-30 justify-center overflow-hidden ">
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* 404 */}
        <p className="text-[120px] font-black leading-none tracking-[-0.06em] sm:text-[160px] text-secondary2">
          404
        </p>

        {/* Heading */}
        <h1 className="mt-2 text-3xl font-bold tracking-tigh sm:text-4xl">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-black/60 dark:text-white/60 sm:text-lg">
          Sorry, the page you’re looking for doesn’t exist or may have been
          moved. Let’s get you back to somewhere familiar.
        </p>

        {/* Button */}
        <Link href={"/"}>
          <Button isIcon fullWidth className={"mt-8"} text="Back to Home" />
        </Link>
      </div>
    </main>
  );
}
