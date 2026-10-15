import Link from "next/link";
import { Logo } from "./Logo";

export function PublicHeader() {
    return (
        <header className="header-surface">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Logo href="/" label="ServiceFlow home" />

                <div className="flex items-center gap-2">
                    <Link href="/login" className="btn-ghost">
                        Sign in
                    </Link>

                    <Link href="/signup" className="btn-primary">
                        Get started
                    </Link>
                </div>
            </div>
        </header>
    );
}
