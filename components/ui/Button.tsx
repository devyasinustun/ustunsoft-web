import { Link } from "@/i18n/navigation";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-control px-6 py-3 font-semibold transition-colors";

// Turuncu zeminde beyaz metin AA'yı geçmediği için primary'de metin mürekkep rengi.
const variants = {
  primary: "bg-brand text-ink hover:bg-[#ff7240]",
  outline: "border-2 border-ink text-ink hover:bg-ink hover:text-paper",
  ink: "bg-ink text-paper hover:bg-[#2a2d3a]",
  outlineOnBrand: "border-2 border-ink text-ink hover:bg-ink hover:text-paper",
} as const;

type ButtonVariant = keyof typeof variants;

// Site içi olmayan bağlantılar (mailto: gibi) düz <a> ile aynı görünümü alsın diye.
export function buttonClassName(variant: ButtonVariant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`;
}

type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
};

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClassName(variant, className)}>
      {children}
    </Link>
  );
}
