import Link from "next/link";

export const fieldClassName =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#2667FF] focus:outline-none focus:ring-1 focus:ring-[#2667FF]";

export const labelClassName = "mb-1 block text-sm font-medium text-slate-700";

export function FieldErrors({ id, errors }: { id: string; errors?: string[] }) {
  return (
    <div id={`${id}-error`} aria-live="polite" aria-atomic="true">
      {errors?.map((error) => (
        <p key={error} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      ))}
    </div>
  );
}

// Added to a field's className when it has errors.
export const invalidFieldClassName = "border-red-500 focus:border-red-500 focus:ring-red-500";

export function FormMessage({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <p role="alert" className="text-sm text-red-600">
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
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <Link
        href={cancelHref}
        className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400"
      >
        {cancelLabel}
      </Link>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-10 items-center justify-center rounded-md bg-[#2667FF] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? pendingLabel : submitLabel}
      </button>
    </div>
  );
}