import Link from "next/link";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 self-start"
          aria-label="ServiceFlow home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2667FF] text-lg font-bold text-white">
            S
          </span>

          <span className="text-xl font-bold tracking-tight text-slate-900">
            Service<span className="text-[#2667FF]">Flow</span>
          </span>
        </Link>

        <Navigation />

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            Sign in
          </Link>

          <Link
            href="/signup"
            className="rounded-md bg-[#2667FF] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC]"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}