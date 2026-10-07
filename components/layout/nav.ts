export const NAV_ITEMS = [
  { key: "apps", href: "/apps/" },
  { key: "about", href: "/about/" },
  { key: "support", href: "/support/" },
  { key: "contact", href: "/contact/" },
] as const;

export type NavLink = { href: string; label: string };
