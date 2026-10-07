import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export async function ClosingCta() {
  const t = await getTranslations("home.cta");

  return (
    <section className="bg-brand text-ink">
      <Container className="grid items-end gap-8 py-section lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="text-5xl sm:text-7xl">{t("title")}</h2>
          <p className="mt-5 text-xl font-medium">{t("body")}</p>
        </div>
        <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
          <ButtonLink href="/contact/" variant="ink">
            {t("primary")}
          </ButtonLink>
          <ButtonLink href="/apps/" variant="outlineOnBrand">
            {t("secondary")}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
