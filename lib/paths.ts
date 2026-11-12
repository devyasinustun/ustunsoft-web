import type { Locale } from "@/i18n/routing";

// Dil ön eki olmadan, baştaki ve sondaki eğik çizgiyle ("/", "/apps/").
// Yol dile göre değişiyorsa her dil için ayrı verilir.
export type LocalizedPath = string | Record<Locale, string>;

export function pathFor(path: LocalizedPath, locale: Locale): string {
  return typeof path === "string" ? path : path[locale];
}

// Dile göre değişen yol parçaları. Mağaza kayıtları bu adreslere bağlı
// (Play Console → Veri güvenliği → Hesap silme); değiştirme.
export const DATA_DELETION_SEGMENT: Record<Locale, string> = {
  tr: "veri-silme",
  en: "data-deletion",
};

// Dil ön eki olmadan: "/apps/peckaroo/veri-silme/".
export function dataDeletionPath(slug: string, locale: Locale): string {
  return `/apps/${slug}/${DATA_DELETION_SEGMENT[locale]}/`;
}

export function dataDeletionPaths(slug: string): Record<Locale, string> {
  return { tr: dataDeletionPath(slug, "tr"), en: dataDeletionPath(slug, "en") };
}

// Dil değiştirirken yolun dile bağlı parçalarını hedef dile çevirir.
export function translatePathname(pathname: string, from: Locale, to: Locale): string {
  return pathname
    .split("/")
    .map((part) => (part === DATA_DELETION_SEGMENT[from] ? DATA_DELETION_SEGMENT[to] : part))
    .join("/");
}
