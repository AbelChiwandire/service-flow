"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

const navigationLinks = [
    { href: "/dashboard", label: "Dashboard", iconClass: "icon-mask-dashboard" },
    { href: "/customers", label: "Customers", iconClass: "icon-mask-customers" },
    { href: "/jobs", label: "Jobs", iconClass: "icon-mask-jobs" },
];

type SidebarNavProps = {
    label: string;
    onNavigate?: () => void;
    collapsible?: boolean;
};

function SidebarNav({ label, onNavigate, collapsible }: SidebarNavProps) {
    const pathname = usePathname();
    const labelClass = collapsible
        ? "opacity-0 transition-opacity group-hover:opacity-100 group-has-[:focus-visible]:opacity-100"
        : "";

    return (
        <nav aria-label={label}>
            <ul className="space-y-1">
                {navigationLinks.map((link) => {
                    const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

                    return (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                onClick={onNavigate}
                                aria-current={isActive ? "page" : undefined}
                                className={`nav-link ${isActive ? "nav-link-active" : "nav-link-idle"}`}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`icon-mask h-5 w-5 shrink-0 ${link.iconClass}`}
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
                <aside className="group fixed inset-y-0 left-0 z-40 w-16 overflow-hidden border-r border-border bg-white transition-[width] duration-200 hover:w-64 has-[:focus-visible]:w-64">
                    <div className="flex h-16 items-center border-b border-border px-4">
                        <Logo
                            href="/dashboard"
                            label="ServiceFlow dashboard"
                            titleClassName="opacity-0 transition-opacity group-hover:opacity-100 group-has-[:focus-visible]:opacity-100"
                        />
                    </div>

                    <div className="p-2 pt-4">
                        <SidebarNav label="Main navigation" collapsible />
                    </div>
                </aside>
            </div>

            {/* Tablet/mobile: slide-over drawer opened from the header menu button */}
            <div
                className={`fixed inset-0 z-40 lg:hidden ${isOpen ? "" : "pointer-events-none"}`}
                inert={!isOpen}
            >
                <div
                    onClick={onClose}
                    aria-hidden="true"
                    className={`absolute inset-0 bg-black/40 transition-opacity ${
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
                            className="shrink-0 btn-icon"
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
