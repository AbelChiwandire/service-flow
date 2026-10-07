"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

const navigationLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "/dashboard.svg" },
  { href: "/customers", label: "Customers", icon: "/customers.svg" },
  { href: "/jobs", label: "Jobs", icon: "/jobs.svg" },
];

type SidebarNavProps = {
  label: string;
  onNavigate?: () => void;
  collapsible?: boolean;
};

function SidebarNav({ label, onNavigate, collapsible }: SidebarNavProps) {
  const pathname = usePathname();
  const labelClass = collapsible
    ? "opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
    : "";

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
                className={`flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2667FF] ${
                  isActive
                    ? "bg-blue-50 text-[#2667FF]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Image
                  src={link.icon}
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5 shrink-0"
                />
                <span className={labelClass}>{link.label}</span>
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
      {/* Desktop: reserves the collapsed width; the inner panel expands over content on hover */}
      <div className="hidden w-16 shrink-0 lg:block">
        <aside className="group fixed inset-y-0 left-0 z-40 w-16 overflow-hidden border-r border-slate-200 bg-white transition-[width] duration-200 hover:w-64 focus-within:w-64">
          <div className="flex h-16 items-center border-b border-slate-200 px-3.5">
            <Logo
              href="/dashboard"
              label="ServiceFlow dashboard"
              titleClassName="opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
            />
          </div>

          <div className="p-2 pt-4">
            <SidebarNav label="Main navigation" collapsible />
          </div>
        </aside>
      </div>

      {/* Tablet/mobile: slide-over drawer opened from the header menu button */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
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
          <div className="mb-4 flex items-center justify-between gap-2">
            <Logo href="/dashboard" label="ServiceFlow dashboard" />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="shrink-0 rounded-md p-2 text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2667FF]"
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
