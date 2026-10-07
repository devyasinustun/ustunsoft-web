"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { Link } from "@/i18n/navigation";
import { CONTACT_EMAIL } from "@/lib/site";

const ENDPOINT = "https://api.web3forms.com/submit";
type Field = "name" | "email" | "subject" | "message" | "consent";
type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "mt-2 block w-full rounded-control border-2 border-line bg-card px-4 py-3 text-ink aria-invalid:border-[#b3261e] focus:border-ink";

function validate(data: FormData): Field[] {
  const text = (key: string) => String(data.get(key) ?? "").trim();
  const invalid: Field[] = [];
  if (text("name").length < 2) invalid.push("name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text("email"))) invalid.push("email");
  if (text("subject").length < 2) invalid.push("subject");
  if (text("message").length < 10) invalid.push("message");
  if (data.get("consent") !== "on") invalid.push("consent");
  return invalid;
}

// accessKey: NEXT_PUBLIC_WEB3FORMS_KEY. Web3Forms anahtarı gizli değildir, tarayıcıda görünür.
export function ContactForm({ accessKey }: { accessKey: string }) {
  const t = useTranslations("contact.form");
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [invalid, setInvalid] = useState<Field[]>([]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const errors = validate(data);
    setInvalid(errors);
    if (errors.length > 0) {
      form.querySelector<HTMLElement>(`[name="${errors[0]}"]`)?.focus();
      return;
    }

    // Honeypot: gerçek kullanıcı bu alanı görmez. Doluysa göndermeden başarılı gibi davranırız.
    if (data.get("botcheck")) {
      setStatus("success");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          from_name: "ustunsoft.com",
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
        }),
      });
      const result: { success?: boolean } = await response.json();
      if (!response.ok || !result.success) throw new Error("Web3Forms");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-card border-2 border-ink bg-card p-6 sm:p-8">
        <h2 className="text-3xl">{t("successTitle")}</h2>
        <p className="mt-3 text-lg text-ink-muted">{t("successBody")}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 font-semibold underline decoration-2 underline-offset-4"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  const error = (field: Field) =>
    invalid.includes(field) ? (
      <p id={`${id}-${field}-error`} className="mt-2 text-sm font-semibold text-[#b3261e]">
        {t(`errors.${field}`)}
      </p>
    ) : null;
  const fieldProps = (field: Field) => ({
    id: `${id}-${field}`,
    name: field,
    required: true,
    "aria-invalid": invalid.includes(field) || undefined,
    "aria-describedby": invalid.includes(field) ? `${id}-${field}-error` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="text-3xl sm:text-4xl">
        {t("title")}
      </h2>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="font-semibold">
            {t("name")}
          </label>
          <input {...fieldProps("name")} type="text" autoComplete="name" className={inputClass} />
          {error("name")}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="font-semibold">
            {t("email")}
          </label>
          <input
            {...fieldProps("email")}
            type="email"
            autoComplete="email"
            className={inputClass}
          />
          {error("email")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-subject`} className="font-semibold">
            {t("subject")}
          </label>
          <input {...fieldProps("subject")} type="text" className={inputClass} />
          {error("subject")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-message`} className="font-semibold">
            {t("message")}
          </label>
          <textarea {...fieldProps("message")} rows={6} className={inputClass} />
          {error("message")}
        </div>
      </div>

      {/* Honeypot: ekranda ve erişilebilirlik ağacında yok, yalnızca botlar doldurur. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="mt-6">
        <div className="flex items-start gap-3">
          <input
            {...fieldProps("consent")}
            type="checkbox"
            className="mt-1 size-5 shrink-0 accent-ink"
          />
          <label htmlFor={`${id}-consent`}>
            {t.rich("consent", {
              link: (chunks) => (
                <Link
                  href="/legal/contact-form/"
                  className="font-semibold underline decoration-2 underline-offset-4"
                >
                  {chunks}
                </Link>
              ),
            })}
          </label>
        </div>
        {error("consent")}
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-control bg-brand px-8 py-3 font-semibold text-ink transition-colors hover:bg-[#ff7240] disabled:opacity-60"
      >
        {status === "sending" ? t("sending") : t("submit")}
      </button>

      <div aria-live="polite">
        {status === "error" && (
          <p className="mt-4 font-semibold text-[#b3261e]">
            {t("error")}{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
          </p>
        )}
      </div>
    </form>
  );
}
