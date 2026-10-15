import Link from "next/link";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    getPageHref: (page: number) => string;
};

export function Pagination({
    currentPage,
    totalPages: rawTotalPages,
    getPageHref,
}: PaginationProps) {
    // An empty result still counts as one page, so the controls never disappear.
    const totalPages = Math.max(1, rawTotalPages);

    return (
        <nav aria-label="Pagination" className="mt-auto flex items-center justify-between pt-4">
            {currentPage > 1 ? (
                <Link href={getPageHref(currentPage - 1)} className="btn-secondary">
                    Previous
                </Link>
            ) : (
                <span aria-disabled="true" className="btn-disabled">
                    Previous
                </span>
            )}

            <p className="small-text">
                Page {currentPage} of {totalPages}
            </p>

            {currentPage < totalPages ? (
                <Link href={getPageHref(currentPage + 1)} className="btn-secondary">
                    Next
                </Link>
            ) : (
                <span aria-disabled="true" className="btn-disabled">
                    Next
                </span>
            )}
        </nav>
    );
}
