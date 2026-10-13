import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  getPageHref: (page: number) => string;
};

const enabledClassName =
  "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[#2667FF] hover:text-[#2667FF]";

const disabledClassName =
  "rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-400";

export function Pagination({
  currentPage,
  totalPages,
  getPageHref,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between">
      {currentPage > 1 ? (
        <Link href={getPageHref(currentPage - 1)} className={enabledClassName}>
          Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClassName}>
          Previous
        </span>
      )}

      <p className="text-sm text-slate-600">
        Page {currentPage} of {totalPages}
      </p>

      {currentPage < totalPages ? (
        <Link href={getPageHref(currentPage + 1)} className={enabledClassName}>
          Next
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClassName}>
          Next
        </span>
      )}
    </nav>
  );
}
