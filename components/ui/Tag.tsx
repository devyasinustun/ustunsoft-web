const variants = {
  neutral: "border border-line bg-paper text-ink",
  ink: "bg-ink text-paper",
} as const;

type TagProps = {
  variant?: keyof typeof variants;
  children: React.ReactNode;
};

export function Tag({ variant = "neutral", children }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
