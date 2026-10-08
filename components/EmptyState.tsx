import type { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  message: string;
  action?: ReactNode;
}

export function EmptyState({
  title = "Nothing here yet",
  message,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#2667FF]">
        <span className="text-xl" aria-hidden="true">
          +
        </span>
      </div>

      <h2 className="mt-4 text-lg font-semibold text-slate-900">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
        {message}
      </p>

      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}