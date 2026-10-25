"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** next/image fill wrapper with a graceful fallback if the photo fails to load. */
export default function ProductImage({ src, alt, sizes, priority, className = "" }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="@container absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-hidden bg-gradient-to-br from-surface-2 to-surface text-muted"
      >
        <ImageOff className="size-5 @[8rem]:size-7" aria-hidden />
        <span className="hidden text-xs @[8rem]:block">Image unavailable</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
