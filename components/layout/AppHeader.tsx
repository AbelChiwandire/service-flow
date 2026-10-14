"use client";

import { AccountMenu } from "./AccountMenu";
import { Logo } from "./Logo";

type AppHeaderProps = {
    isMenuOpen: boolean;
    onMenuClick: () => void;
};

export function AppHeader({ isMenuOpen, onMenuClick }: AppHeaderProps) {
    return (
        <header className="sticky top-0 z-30 header-surface">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        aria-label="Open navigation menu"
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-navigation"
                        className="lg:hidden btn-icon"
                    >
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                        >
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="lg:hidden">
                        <Logo href="/dashboard" label="ServiceFlow dashboard" />
                    </div>
                </div>

                <AccountMenu />
            </div>
        </header>
    );
}
