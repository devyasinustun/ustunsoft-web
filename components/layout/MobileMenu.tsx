"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { NavLink } from "./nav";

type MobileMenuProps = {
  links: NavLink[];
  navLabel: string;
  openLabel: string;
  closeLabel: string;
};

export function MobileMenu({ links, navLabel, openLabel, closeLabel }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
        className="flex size-10 items-center justify-center rounded-control border border-line"
      >
        {open ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
      </button>

      <nav
        id={panelId}
        aria-label={navLabel}
        hidden={!open}
        className="absolute inset-x-0 top-full z-40 border-b border-line bg-paper"
      >
        <ul className="px-gutter py-2 sm:px-8">
          {links.map((link) => (
            <li key={link.href} className="border-b border-line last:border-b-0">
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-4 font-display text-2xl font-extrabold tracking-tight"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
