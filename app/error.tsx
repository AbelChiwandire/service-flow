"use client";

import { useEffect } from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { ErrorState } from "@/components/shared/ErrorState";

export default function RootError({
    error,
    retry,
}: {
    error: Error & { digest?: string };
    retry: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="page-shell">
            <PublicHeader />

            <main className="page-main-centered">
                <ErrorState onRetry={retry} homeHref="/" homeLabel="Go to home page" />
            </main>
        </div>
    );
}