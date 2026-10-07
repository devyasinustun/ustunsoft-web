import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

// "/" yalnızca dil yönlendirmesi yapar (betik layout'ta). Bu içerik JS kapalıyken
// ya da yönlendirme gecikirse görünür.
export default function RootRedirectPage() {
  return (
    <main className="flex min-h-dvh flex-col items-start justify-center gap-6 px-gutter py-16 sm:px-10">
      <p className="text-4xl font-extrabold tracking-tight">{SITE_NAME}</p>
      <ul className="flex flex-wrap gap-3 text-lg font-semibold">
        <li>
          <Link
            className="inline-block rounded-control bg-ink px-5 py-3 text-paper"
            href="/tr/"
            lang="tr"
            hrefLang="tr"
          >
            Türkçe
          </Link>
        </li>
        <li>
          <Link
            className="inline-block rounded-control border-2 border-ink px-5 py-3"
            href="/en/"
            lang="en"
            hrefLang="en"
          >
            English
          </Link>
        </li>
      </ul>
    </main>
  );
}
