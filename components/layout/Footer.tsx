import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import { CONTACT_EMAIL, PRIVACY_PATH, TERMS_PATH } from "@/lib/site";
import { NAV_ITEMS } from "./nav";
import { Wordmark } from "./Wordmark";

const linkClass = "underline-offset-4 hover:underline";

export async function Footer() {
  const t = await getTranslations();

  return (
    <footer className="on-ink bg-ink text-paper">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Wordmark className="text-3xl" />
          <p className="mt-4 max-w-xs text-ink-soft">{t("footer.tagline")}</p>
          <p className="mt-1 text-ink-soft">{t("footer.location")}</p>
        </div>

        <nav aria-label={t("footer.pages")} className="lg:col-span-2">
          <h2 className="font-sans text-sm font-semibold tracking-normal text-ink-soft">
            {t("footer.pages")}
          </h2>
          <ul className="mt-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("footer.legal")} className="lg:col-span-2">
          <h2 className="font-sans text-sm font-semibold tracking-normal text-ink-soft">
            {t("footer.legal")}
          </h2>
          {/* Statik dosyalar: Link değil düz <a>, yönlendirme ve prefetch olmadan. */}
          <ul className="mt-4 space-y-2">
            <li>
              <a href={PRIVACY_PATH} className={linkClass}>
                {t("footer.privacy")}
              </a>
            </li>
            <li>
              <a href={TERMS_PATH} className={linkClass}>
                {t("footer.terms")}
              </a>
            </li>
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <h2 className="font-sans text-sm font-semibold tracking-normal text-ink-soft">
            {t("footer.contact")}
          </h2>
          <a href={`mailto:${CONTACT_EMAIL}`} className={`mt-4 block wrap-anywhere ${linkClass}`}>
            {CONTACT_EMAIL}
          </a>
        </div>
      </Container>

      <div className="border-t border-white/15">
        <Container className="py-5 text-sm text-ink-soft">
          {t("footer.rights", { year: new Date().getFullYear() })}
        </Container>
      </div>
    </footer>
  );
}
