"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared/ErrorState";

export default function AuthenticatedError({
    error,
    retry,
}: {
    error: Error & { digest?: string };
    retry: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return <ErrorState onRetry={retry} homeHref="/dashboard" homeLabel="Go to dashboard" />;
}