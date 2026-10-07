import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";
import { NAV_ITEMS, type NavLink } from "./nav";
import { Wordmark } from "./Wordmark";

export async function Header() {
  const t = await getTranslations("nav");
  const links: NavLink[] = NAV_ITEMS.map((item) => ({ href: item.href, label: t(item.key) }));

  return (
    <header className="relative border-b border-line bg-paper">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="shrink-0">
          <Wordmark />
          <span className="sr-only">: {t("home")}</span>
        </Link>

        <nav aria-label={t("label")} className="hidden md:block">
          <ul className="flex items-center gap-8 font-semibold">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="underline-offset-8 decoration-2 decoration-brand hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <MobileMenu
            links={links}
            navLabel={t("label")}
            openLabel={t("openMenu")}
            closeLabel={t("closeMenu")}
          />
        </div>
      </Container>
    </header>
  );
}
