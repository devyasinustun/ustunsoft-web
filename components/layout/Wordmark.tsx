import Image from "next/image";
import { SITE_NAME } from "@/lib/site";

// Logo işareti scripts/make-brand-assets.mjs ile brand/logo-source.jpg'den üretilir (saydam zemin).
const LOGO = { src: "/logo.webp", width: 120, height: 96 };

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-display text-2xl font-extrabold tracking-tight ${className}`}
    >
      <Image
        src={LOGO.src}
        alt=""
        width={LOGO.width}
        height={LOGO.height}
        className="h-[1.4em] w-auto"
      />
      {SITE_NAME}
    </span>
  );
}
