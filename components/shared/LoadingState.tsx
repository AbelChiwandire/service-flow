interface LoadingStateProps {
    message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
    return (
        <div
            className="flex min-h-40 items-center justify-center gap-2 card-padded"
            role="status"
            aria-live="polite"
        >
            <span className="spinner" aria-hidden="true" />

            <span className="small-text">{message}</span>
        </div>
    );
}
