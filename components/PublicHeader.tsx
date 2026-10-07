import Link from "next/link";
import { Logo } from "./Logo";

export function PublicHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo href="/" label="ServiceFlow home" />

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