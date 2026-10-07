"use client";

import { Logo } from "./Logo";

type AppHeaderProps = {
  isMenuOpen: boolean;
  onMenuClick: () => void;
};

export function AppHeader({ isMenuOpen, onMenuClick }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            className="rounded-md p-2 text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2667FF] md:hidden"
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

          <Logo href="/dashboard" label="ServiceFlow dashboard" />
        </div>

        {/* Account controls: placeholder until auth (#18) is merged. */}
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-[#2667FF]"
          >
            U
          </span>

          <button
            type="button"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2667FF]"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}