import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { AppIcon } from "@/components/apps/AppIcon";
import { PhoneFrame } from "@/components/apps/PhoneFrame";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/i18n/routing";
import { getFeaturedApps } from "@/lib/apps";

export async function Hero() {
  const t = await getTranslations("home.hero");
  const locale = (await getLocale()) as Locale;
  const [first, second] = (await getFeaturedApps()).filter((app) => app.screenshots.length > 0);

  return (
    <section className="overflow-hidden border-b border-line">
      <Container className="grid items-center gap-12 py-14 lg:grid-cols-12 lg:gap-8 lg:py-24">
        <div className="lg:col-span-7">
          <p className="font-semibold text-ink-muted">{t("eyebrow")}</p>
          <h1 className="mt-4 text-[clamp(2.75rem,8.5vw,6.25rem)] leading-[0.95] tracking-[-0.035em]">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-muted sm:text-xl">{t("body")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/apps/">
              {t("primaryCta")}
              <ArrowRight aria-hidden="true" size={20} />
            </ButtonLink>
            <ButtonLink href="/contact/" variant="outline">
              {t("secondaryCta")}
            </ButtonLink>
          </div>
        </div>

        {first && second && (
          <div className="relative mx-auto flex w-full max-w-md items-start justify-center gap-4 lg:col-span-5 lg:max-w-none">
            <div className="relative w-[46%] -rotate-3">
              <PhoneFrame
                {...first.screenshots[0]}
                alt={t("screenshotAlt", { name: first.name[locale] })}
                sizes="(min-width: 1024px) 15rem, 40vw"
                preload
              />
              <AppIcon
                app={first}
                size={72}
                className="absolute -bottom-5 -left-4 border-4 border-paper"
              />
            </div>
            <div className="relative mt-12 w-[46%] rotate-3">
              <PhoneFrame
                {...second.screenshots[0]}
                alt={t("screenshotAlt", { name: second.name[locale] })}
                sizes="(min-width: 1024px) 15rem, 40vw"
                preload
              />
              <AppIcon
                app={second}
                size={72}
                className="absolute -right-4 -top-5 border-4 border-paper"
              />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
