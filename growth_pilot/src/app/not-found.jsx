import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6">

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* 404 */}
        <p className="text-[120px] font-black leading-none tracking-[-0.06em] text-gray-900 sm:text-[160px]">
          404
        </p>

        {/* Heading */}
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-gray-500 sm:text-lg">
          Sorry, the page you’re looking for doesn’t exist or may have been
          moved. Let’s get you back to somewhere familiar.
        </p>

        {/* Button */}
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>

          Back to Home
        </Link>
      </div>
    </main>
  );
}