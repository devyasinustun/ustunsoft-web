import type { Metadata } from "next";
import { Wordmark } from "@/components/layout/Wordmark";
import { SITE_ICONS } from "@/lib/seo";
import { LOCALE_STORAGE_KEY } from "@/lib/site";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı · Page not found · ustunsoft",
  icons: SITE_ICONS,
};

// Statik barındırmada tek bir 404.html var; dili tarayıcıda, sayfa boyanmadan önce seçeriz:
// adres /tr/ ya da /en/ ile başlıyorsa o dil, yoksa sitede son seçilen dil, o da yoksa tarayıcı dili.
const localeScript = `(function(){var m=location.pathname.match(/^\\/(tr|en)(\\/|$)/),l=m&&m[1];if(!l){try{l=localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)})}catch(e){}}if(l!=="tr"&&l!=="en"){var n=(navigator.languages&&navigator.languages[0])||navigator.language||"";l=n.toLowerCase().indexOf("tr")===0?"tr":"en"}document.documentElement.lang=l})()`;

const localeStyle = `html[lang="tr"] [data-locale="en"],html[lang="en"] [data-locale="tr"]{display:none}`;

const COPY = {
  tr: {
    title: "Bu sayfa yok.",
    body: "Adres yanlış yazılmış ya da sayfa taşınmış olabilir.",
    home: "Ana sayfaya dön",
    apps: "Uygulamalara bak",
  },
  en: {
    title: "This page doesn't exist.",
    body: "The address may be mistyped, or the page may have moved.",
    home: "Back to home",
    apps: "See the apps",
  },
} as const;

export default function GlobalNotFound() {
  return (
    <html lang="tr" className={`${fontVariables} antialiased`} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: localeStyle }} />
        <script dangerouslySetInnerHTML={{ __html: localeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <main className="mx-auto flex w-full max-w-site flex-1 flex-col justify-center px-gutter py-16 sm:px-8">
          <Wordmark />
          <p
            aria-hidden="true"
            className="mt-10 font-display text-[clamp(6rem,28vw,16rem)] font-extrabold leading-none tracking-tighter text-brand"
          >
            404
          </p>
          {(["tr", "en"] as const).map((locale) => (
            <div key={locale} data-locale={locale} lang={locale}>
              <h1 className="mt-4 text-4xl sm:text-6xl">{COPY[locale].title}</h1>
              <p className="mt-4 max-w-md text-lg text-ink-muted">{COPY[locale].body}</p>
              <ul className="mt-8 flex flex-wrap gap-3 font-semibold">
                <li>
                  <a
                    href={`/${locale}/`}
                    className="inline-block rounded-control bg-ink px-5 py-3 text-paper"
                  >
                    {COPY[locale].home}
                  </a>
                </li>
                <li>
                  <a
                    href={`/${locale}/apps/`}
                    className="inline-block rounded-control border-2 border-ink px-5 py-3"
                  >
                    {COPY[locale].apps}
                  </a>
                </li>
              </ul>
            </div>
          ))}
        </main>
      </body>
    </html>
  );
}
