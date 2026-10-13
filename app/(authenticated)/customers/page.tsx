import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import {
    ITEMS_PER_PAGE,
    countCustomers,
    getCustomers,
    type CustomerListParams,
} from "@/lib/db/customer/repository";
import { parseCustomerFilter, parsePage, parseQuery } from "@/lib/db/dashboard/search-params";
import { requireUserId } from "@/lib/auth/session";
import CustomerList from "@/components/customers/CustomerList";
import { CustomerFilters } from "@/components/customers/CustomerFilters";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";

export const metadata: Metadata = {
    title: "Customers",
    description: "Manage your customer information and keep every relationship in one place.",
};

// Customers depend on the signed-in user and the URL, so never prerender at build time.
export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

const primaryLinkClassName =
    "inline-flex h-10 items-center justify-center rounded-md bg-[#2667FF] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC]";

export default async function CustomersPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const params = await searchParams;

    const filters: CustomerListParams = {
        query: parseQuery(params.query).slice(0, 100) || undefined,
        page: parsePage(params.page),
        filter: parseCustomerFilter(params.filter),
    };
    const page = filters.page ?? 1;

    function getPageHref(targetPage: number): string {
        const search = new URLSearchParams();
        if (filters.query) search.set("query", filters.query);
        if (filters.filter) search.set("filter", filters.filter);
        if (targetPage > 1) search.set("page", String(targetPage));

        const queryString = search.toString();
        return queryString ? `/customers?${queryString}` : "/customers";
    }

    const userId = await requireUserId();
    const [customers, totalCount] = await Promise.all([
        getCustomers(userId, filters),
        countCustomers(userId, filters),
    ]);
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // A stale link (for example page 9 after filtering) goes to the last real page.
    const lastPage = Math.max(1, totalPages);
    if (page > lastPage) {
        redirect(getPageHref(lastPage));
    }
    const hasFilters = Boolean(filters.query || filters.filter);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Customers"
                description="Manage your customer information and keep every relationship in one place."
                action={
                    <Link href="/customers/new" className={primaryLinkClassName}>
                        Add customer
                    </Link>
                }
            />

            <CustomerFilters />

            {customers.length === 0 ? (
                hasFilters ? (
                    <EmptyState
                        title="No matching customers"
                        message="Try a different search term or filter."
                    />
                ) : (
                    <EmptyState
                        title="No customers yet"
                        message="Add your first customer to start scheduling jobs."
                        action={
                            <Link href="/customers/new" className={primaryLinkClassName}>
                                Add customer
                            </Link>
                        }
                    />
                )
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        {totalCount} {totalCount === 1 ? "customer" : "customers"}
                    </p>

                    <CustomerList customers={customers} />

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        getPageHref={getPageHref}
                    />
                </div>
            )}
        </div>
    );
}