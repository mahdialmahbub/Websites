// src/app/components/CoverImage.jsx
import Image from "next/image";

/**
 * Optimized cover image. `sizes` tells the browser how wide the image is
 * really shown, so it downloads a small file instead of the 1200px original.
 *
 * @param {{
 *   src: string,
 *   alt?: string,
 *   priority?: boolean,
 *   sizes?: string,
 *   className?: string
 * }} props
 */
export default function CoverImage({
  src,
  alt = "",
  priority = false,
  // Adjust to your real grid, for example "(min-width: 1024px) 33vw, 100vw" for 3 columns
  sizes = "(min-width: 1024px) 40vw, 100vw",
  className = "aspect-3/2",
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className="object-cover"
      />
    </div>
  );
}
