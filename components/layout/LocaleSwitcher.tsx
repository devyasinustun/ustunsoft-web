"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { LOCALE_STORAGE_KEY } from "@/lib/site";

export function LocaleSwitcher() {
  const t = useTranslations("localeSwitcher");
  const locale = useLocale();
  const pathname = usePathname();

  // Kök sayfa ve 404, ziyaretçiyi son gezdiği dile götürmek için bunu okur.
  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Depolama kapalıysa tarayıcı diline göre davranılır.
    }
  }, [locale]);

  return (
    <nav aria-label={t("label")}>
      <ul className="flex items-center rounded-control border border-line text-sm font-semibold">
        {routing.locales.map((target) => {
          const current = target === locale;
          return (
            <li key={target}>
              <Link
                href={pathname}
                locale={target}
                lang={target}
                hrefLang={target}
                aria-label={t(target)}
                aria-current={current ? "true" : undefined}
                className={`block rounded-[7px] px-3 py-2 uppercase ${current ? "bg-ink text-paper" : "text-ink-muted hover:text-ink"}`}
              >
                {target}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
