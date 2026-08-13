"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function GalleryImage({
  src,
  alt,
  className,
  priority,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => setLoaded(false), [src]);

  /* Visitor uploads use blob: object URLs, which the image optimizer can't fetch server-side */
  const unoptimized = src.startsWith("blob:") || src.startsWith("data:");

  return (
    <>
      <span className={`nd-image-skeleton ${loaded ? "nd-image-skeleton--hidden" : ""}`} aria-hidden="true" />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        className={`${className ?? ""} ${loaded ? "nd-image-loaded" : "nd-image-loading"}`.trim()}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}
