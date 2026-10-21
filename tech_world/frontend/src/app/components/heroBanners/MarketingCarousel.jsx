import Image from "next/image";
import Link from "next/link";
import CarouselShell from "./CarouselShell";
import { banners } from "./banners";

export default function MarketingCarousel() {
  return (
    <CarouselShell>
      {banners.map((banner, index) => (
        <article
          key={banner.id}
          aria-label={banner.title}
          className="absolute inset-0"
        >
          <Image
            src={banner.image}
            alt={banner.alt}
            fill
            priority={index === 0}
            fetchPriority={index === 0 ? "high" : "auto"}
            sizes="(max-width: 768px) 100vw, 1400px"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-r from-black via-black/75 to-transparent" />
          <div className="absolute inset-0 bg-black/10" />

          <div className="absolute inset-y-0 left-0 flex w-full items-center">
            <div className="w-full max-w-170 px-6 sm:px-8 md:px-10 lg:px-14 xl:px-16">
              <span className="mb-3 inline-flex translate-y-3 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[9px] font-semibold tracking-[0.18em] text-white opacity-0 backdrop-blur-sm transition-all duration-700 group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100 sm:mb-4 sm:px-4 sm:py-1.5">
                {banner.badge}
              </span>

              {/* h1 na, h2 — page er main h1 alada thakbe */}
              <h2 className="max-w-155 translate-y-5 font-primary text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-white opacity-0 transition-all duration-700 group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100 sm:text-4xl lg:text-[48px]">
                {banner.title}
              </h2>

              <p className="mt-3 max-w-115 translate-y-5 text-[11px] leading-[1.6] text-white/75 opacity-0 transition-all delay-100 duration-700 group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100 sm:mt-4 sm:text-xs md:text-sm lg:text-[15px]">
                {banner.description}
              </p>

              <div className="mt-5 translate-y-5 opacity-0 transition-all delay-200 duration-700 group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100 sm:mt-6">
                <Link
                  href={banner.buttonLink}
                  className="inline-flex items-center gap-2 rounded-xl bg-secondary/10 px-4 py-2.5 font-primary text-xs font-semibold text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary/20 sm:px-5 sm:py-3 sm:text-sm"
                >
                  {banner.buttonText}
                  <i
                    className="fi fi-rr-arrow-small-right text-[16px]"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </article>
      ))}
    </CarouselShell>
  );
}