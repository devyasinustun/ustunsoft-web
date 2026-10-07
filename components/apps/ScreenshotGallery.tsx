"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import type { App } from "@/types/app";

type ScreenshotGalleryProps = {
  name: string;
  screenshots: App["screenshots"];
};

const controlClass =
  "flex size-12 items-center justify-center rounded-full bg-paper text-ink transition-colors hover:bg-white disabled:opacity-40";

// Yatay kaydırmalı galeri + lightbox. Lightbox yerel <dialog>: Esc ile kapanır, odak içeride
// tutulur ve kapanınca tıklanan küçük görsele geri döner.
export function ScreenshotGallery({ name, screenshots }: ScreenshotGalleryProps) {
  const t = useTranslations("appDetail.gallery");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const total = screenshots.length;
  const current = screenshots[index];

  const open = (target: number) => {
    setIndex(target);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = (delta: number) => setIndex((value) => (value + delta + total) % total);

  return (
    <>
      <ul className="flex snap-x gap-4 overflow-x-auto pb-4">
        {screenshots.map((shot, i) => {
          const landscape = shot.width > shot.height;
          return (
            <li key={shot.src} className="shrink-0 snap-start self-center">
              <button
                type="button"
                onClick={() => open(i)}
                aria-label={t("open", { index: i + 1, total })}
                className="block overflow-hidden rounded-card border border-line bg-card transition-colors hover:border-ink"
              >
                <Image
                  src={shot.src}
                  alt={t("alt", { name, index: i + 1 })}
                  width={shot.width}
                  height={shot.height}
                  sizes={landscape ? "(min-width: 640px) 28rem, 80vw" : "14rem"}
                  // İlk görsel mobilde sayfanın en büyük öğesi (LCP); öncelikli yüklenir.
                  preload={i === 0}
                  fetchPriority={i === 0 ? "high" : undefined}
                  loading={i === 0 ? undefined : "lazy"}
                  className={landscape ? "h-auto w-[min(28rem,80vw)]" : "h-auto w-48 sm:w-56"}
                />
              </button>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={t("dialog", { name })}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") step(-1);
          if (event.key === "ArrowRight") step(1);
        }}
        className="on-ink fixed inset-0 m-0 size-full max-h-none max-w-none bg-ink/95 p-4 text-paper backdrop:bg-ink/60 open:flex open:flex-col"
      >
        <div className="flex items-center justify-between gap-4">
          <p aria-live="polite" className="font-semibold tabular-nums">
            {t("position", { index: index + 1, total })}
          </p>
          <button type="button" onClick={close} aria-label={t("close")} className={controlClass}>
            <X aria-hidden="true" size={24} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center gap-3 py-4">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={t("previous")}
            disabled={total < 2}
            className={`${controlClass} shrink-0`}
          >
            <ChevronLeft aria-hidden="true" size={24} />
          </button>
          {current && (
            <Image
              key={current.src}
              src={current.src}
              alt={t("alt", { name, index: index + 1 })}
              width={current.width}
              height={current.height}
              sizes="90vw"
              className="max-h-full min-w-0 max-w-full shrink rounded-card object-contain"
              style={{ width: "auto", height: "auto" }}
            />
          )}
          <button
            type="button"
            onClick={() => step(1)}
            aria-label={t("next")}
            disabled={total < 2}
            className={`${controlClass} shrink-0`}
          >
            <ChevronRight aria-hidden="true" size={24} />
          </button>
        </div>
      </dialog>
    </>
  );
}
