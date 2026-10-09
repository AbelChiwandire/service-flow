interface LoadingStateProps {
    message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
    return (
        <div
            className="flex min-h-40 items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white p-6"
            role="status"
            aria-live="polite"
        >
            <span
                className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-[#2667FF]"
                aria-hidden="true"
            />

            <span className="text-sm text-slate-600">{message}</span>
        </div>
    );
}
