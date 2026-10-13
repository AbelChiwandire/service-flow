import Link from "next/link";

export function Header() {
    return (
        <header className="border-b border-slate-200 bg-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="text-xl font-bold text-[#2667FF]"
                >
                    ServiceFlow
                </Link>

                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-slate-600 transition-colors hover:text-[#2667FF]"
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
            </nav>
        </header>
    );
}