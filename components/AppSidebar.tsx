"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/customers", label: "Customers" },
  { href: "/jobs", label: "Jobs" },
  { href: "/invoices", label: "Invoices" },
];

type SidebarNavProps = {
  label: string;
  onNavigate?: () => void;
};

function SidebarNav({ label, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={label}>
      <ul className="space-y-1">
        {navigationLinks.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2667FF] ${
                  isActive
                    ? "bg-blue-50 text-[#2667FF]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

type AppSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Desktop: fixed column beside the page content */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:block">
        <div className="sticky top-16 p-4">
          <SidebarNav label="Main navigation" />
        </div>
      </aside>

      {/* Mobile: slide-over drawer opened from the header menu button */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          isOpen ? "" : "pointer-events-none"
        }`}
        inert={!isOpen}
      >
        <div
          onClick={onClose}
          aria-hidden="true"
          className={`absolute inset-0 bg-slate-900/40 transition-opacity ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          id="mobile-navigation"
          className={`absolute inset-y-0 left-0 w-64 bg-white p-4 shadow-xl transition-transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-900">Menu</span>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="rounded-md p-2 text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2667FF]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <SidebarNav label="Mobile navigation" onNavigate={onClose} />
        </aside>
      </div>
    </>
  );
}