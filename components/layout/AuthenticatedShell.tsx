"use client";

import { useState } from "react";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";

export function AuthenticatedShell({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AppSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <div className="flex min-w-0 flex-1 flex-col">
                <AppHeader isMenuOpen={isMenuOpen} onMenuClick={() => setIsMenuOpen(true)} />

                <main className="min-w-0 flex-1">
                    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
