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
    <div className="overflow-hidden card-surface">
      <div
        aria-hidden="true"
        className="table-head"
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
    <li className="table-row">
      {children}
    </li>
  );
}