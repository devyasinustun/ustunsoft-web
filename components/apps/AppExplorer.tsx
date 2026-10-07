"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import type { App, AppCategory } from "@/types/app";
import { AppCard } from "./AppCard";

const FILTERS = ["all", "game", "app"] as const;
type Filter = "all" | AppCategory;

export function AppExplorer({ apps }: { apps: App[] }) {
  const t = useTranslations("apps");
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? apps : apps.filter((app) => app.category === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label={t("filterLabel")} className="flex flex-wrap gap-2">
          {FILTERS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={`min-h-11 rounded-full border-2 px-5 font-semibold transition-colors ${
                filter === value
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-card text-ink hover:border-ink"
              }`}
            >
              {t(`filter.${value}`)}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="text-sm text-ink-muted">
          {t("count", { count: visible.length })}
        </p>
      </div>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((app) => (
          <li key={app.slug}>
            <AppCard app={app} headingLevel="h2" />
          </li>
        ))}
      </ul>
    </div>
  );
}
