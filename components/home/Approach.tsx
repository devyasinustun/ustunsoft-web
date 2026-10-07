import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const ITEMS = ["account", "device", "offline", "simple"] as const;

export async function Approach() {
  const t = await getTranslations("home.approach");

  return (
    <section className="py-section">
      <Container className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-10">
            <h2 className="text-5xl sm:text-6xl">{t("title")}</h2>
            <p className="mt-4 text-lg text-ink-muted">{t("intro")}</p>
          </div>
        </div>

        <ol className="lg:col-span-8">
          {ITEMS.map((key, i) => (
            <li key={key} className="border-t-2 border-ink last:border-b-2">
              <Reveal className="grid gap-x-8 gap-y-2 py-8 sm:grid-cols-[5rem_1fr]">
                <span
                  aria-hidden="true"
                  className="font-display text-5xl font-extrabold leading-none tracking-tight text-ink"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-2xl sm:text-3xl">{t(`items.${key}.title`)}</h3>
                  <p className="mt-3 max-w-xl text-lg text-ink-muted">{t(`items.${key}.body`)}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
