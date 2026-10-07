import { SITE_NAME } from "@/lib/site";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight ${className}`}
    >
      <span aria-hidden="true" className="size-3 rounded-[3px] bg-brand" />
      {SITE_NAME}
    </span>
  );
}
