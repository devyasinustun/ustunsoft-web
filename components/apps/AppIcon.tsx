import Image from "next/image";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { toUpper } from "@/lib/format";
import type { App } from "@/types/app";

type AppIconProps = {
  app: App;
  size: number;
  className?: string;
  preload?: boolean;
};

// İkonu olmayan (coming-soon) uygulamada adın baş harfi accentColor zemininde gösterilir.
export function AppIcon({ app, size, className = "", preload = false }: AppIconProps) {
  const locale = useLocale() as Locale;
  const radius = { borderRadius: Math.round(size * 0.22) };

  if (app.icon) {
    return (
      <Image
        src={app.icon}
        alt=""
        width={size}
        height={size}
        preload={preload}
        className={`shrink-0 ${className}`}
        style={radius}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center font-display font-extrabold text-white ${className}`}
      style={{
        ...radius,
        width: size,
        height: size,
        fontSize: size * 0.5,
        backgroundColor: app.accentColor,
      }}
    >
      {toUpper(app.name[locale].charAt(0), locale)}
    </span>
  );
}
