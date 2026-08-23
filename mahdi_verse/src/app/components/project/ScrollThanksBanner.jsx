import { assets } from "@/app/assets/assets";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ScrollThanksBanner({
  backgroundImage = assets.backgroundImage,
  heading = "Thank you for scrolling",
  subheading = "Contact us",
  caseStudyLink = "https://www.behance.net/",
  contactLink = "/contact",
  primaryLabel = "View Details",
  secondaryLabel = "Have a project idea?",
}) {
  return (
    <div className="relative w-full mx-auto rounded-3xl overflow-hidden shadow-xl">
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative flex flex-col items-center justify-center gap-4 py-10 sm:py-12 px-6 text-center">
        <div>
          <h2 className="text-background text-xl sm:text-2xl font-bold  dark:text-foreground">
            {heading}
          </h2>
          <p className="text-background/70  dark:text-foreground/70 text-sm mt-1.5 font-medium">
            {subheading}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          {/* Behance case study link */}
          <Link
            href={caseStudyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-[8px] bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all"
          >
            {primaryLabel}
            <span className="font-bold italic tracking-tight">Bē</span>
          </Link>

          {/* Contact link */}
          <Link
            href={contactLink}
            className="inline-flex items-center gap-2 rounded-[8px] bg-linear-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all"
          >
            {secondaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
