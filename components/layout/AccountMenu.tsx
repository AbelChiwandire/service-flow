"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SignOutButton } from "../auth/SignoutButton";

const MY_ACCOUNT_HREF = "/account";

export function AccountMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        function handlePointerDown(event: MouseEvent) {
            if (!containerRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        }

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
        }
    }, [isOpen]);

    function handleMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();

        const items = Array.from(
            menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
        );
        const index = items.indexOf(document.activeElement as HTMLElement);
        const step = event.key === "ArrowDown" ? 1 : -1;
        items[(index + step + items.length) % items.length]?.focus();
    }

    const close = () => setIsOpen(false);

    return (
        <div ref={containerRef} className="relative">
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-label="Account menu"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-controls="account-menu"
                className="flex items-center gap-2 rounded-full cursor-pointer p-1 text-sm font-medium text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy sm:rounded-md sm:py-1 sm:pr-1 sm:pl-4"
            >
                <span className="hidden sm:inline">Account</span>
                <span
                    aria-hidden="true"
                    className="h-9 w-9 rounded-full text-sm font-semibold icon-tile"
                >
                    U
                </span>
            </button>

            {isOpen && (
                <div
                    ref={menuRef}
                    id="account-menu"
                    role="menu"
                    aria-label="Account"
                    onKeyDown={handleMenuKeyDown}
                    className="absolute right-0 top-full z-50 mt-2 w-48 dropdown-panel"
                >
                    <Link
                        href={MY_ACCOUNT_HREF}
                        role="menuitem"
                        onClick={close}
                        className="dropdown-item"
                    >
                        My Account
                    </Link>

                    <div role="separator" className="my-1 border-t border-border" />

                    <SignOutButton className="dropdown-item" role="menuitem" />
                </div>
            )}
        </div>
    );
}
