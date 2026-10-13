import type { ReactNode } from "react";

export type DataTableColumn = {
  label: string;
  // Column width on md+ screens, for example "md:col-span-4".
  className: string;
};

// Shared list layout: a header row on md+ screens and stacked rows on small screens.
export function DataTable({
  columns,
  children,
}: {
  columns: DataTableColumn[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div
        aria-hidden="true"
        className="hidden grid-cols-12 gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid"
      >
        {columns.map((column) => (
          <span key={column.label} className={column.className}>
            {column.label}
          </span>
        ))}
      </div>

      <ul>{children}</ul>
    </div>
  );
}

export function DataRow({ children }: { children: ReactNode }) {
  return (
    <li className="flex flex-col gap-2 border-b border-slate-200 p-4 last:border-b-0 md:grid md:grid-cols-12 md:items-center md:gap-4">
      {children}
    </li>
  );
}