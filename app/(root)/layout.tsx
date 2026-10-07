import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { SITE_ICONS } from "@/lib/seo";
import { LOCALE_STORAGE_KEY, SITE_NAME, SITE_URL } from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  icons: SITE_ICONS,
  alternates: {
    canonical: "/",
    languages: { tr: "/tr/", en: "/en/", "x-default": "/" },
  },
};

// Önce sitede son seçilen dile, yoksa tarayıcı diline bakar: tr ise /tr/, değilse /en/.
const redirectScript = `(function(){var l;try{l=localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)})}catch(e){}if(l!=="tr"&&l!=="en"){var n=(navigator.languages&&navigator.languages[0])||navigator.language||"";l=n.toLowerCase().indexOf("tr")===0?"tr":"en"}location.replace("/"+l+"/"+location.search+location.hash)})()`;

export default function RootRedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={routing.defaultLocale}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
        <noscript>
          <meta httpEquiv="refresh" content={`0; url=/${routing.defaultLocale}/`} />
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
