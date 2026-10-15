import Link from "next/link";

export function FieldErrors({ id, errors }: { id: string; errors?: string[] }) {
    return (
        <div id={`${id}-error`} aria-live="polite" aria-atomic="true">
            {errors?.map((error) => (
                <p key={error} className="mt-1 error-text">
                    {error}
                </p>
            ))}
        </div>
    );
}

export function FormMessage({ message }: { message?: string | null }) {
    if (!message) return null;

    return (
        <p role="alert" className="error-text">
            {message}
        </p>
    );
}

export function FormActions({
    cancelHref,
    submitLabel,
    isPending,
    cancelLabel = "Cancel",
    pendingLabel = "Saving...",
}: {
    cancelHref: string;
    submitLabel: string;
    isPending: boolean;
    cancelLabel?: string;
    pendingLabel?: string;
}) {
    return (
        <div className="form-actions">
            <Link href={cancelHref} className="btn-secondary">
                {cancelLabel}
            </Link>

            <button type="submit" disabled={isPending} className="btn-primary">
                {isPending ? pendingLabel : submitLabel}
            </button>
        </div>
    );
}
