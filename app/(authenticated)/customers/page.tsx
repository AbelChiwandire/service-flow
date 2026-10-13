import Link from "next/link";
import {
    getCustomers,
    getCustomersTotalPages,
    type CustomerListParams,
} from "@/lib/db/customer/repository";
import { parseCustomerFilter, parsePage, parseQuery } from "@/lib/db/dashboard/search-params";
import { requireUserId } from "@/lib/auth/session";
import CustomerList from "@/components/customers/CustomerList";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function pageHref(filters: CustomerListParams, page: number): string {
    const qs = new URLSearchParams();
    if (filters.query) qs.set("query", filters.query);
    if (filters.filter) qs.set("filter", filters.filter);
    qs.set("page", String(page));
    return `/customers?${qs}`;
}

export default async function CustomersPlaceholderPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const userId = await requireUserId();
    const params = await searchParams;

    const filters: CustomerListParams = {
        query: parseQuery(params.query),
        page: parsePage(params.page),
        filter: parseCustomerFilter(params.filter),
    };

    const [customers, totalPages] = await Promise.all([
        getCustomers(userId, filters),
        getCustomersTotalPages(userId, filters),
    ]);

    const page = filters.page ?? 1;

    return (
        <main>
            <PageHeader
                title="Customers"
                description="Manage your customer information and keep every relationship in one place."
                action={
                    <Link
                        href="/customers/new"
                        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#2667FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF] focus-visible:ring-offset-2"
                    >
                        Add Customer
                    </Link>
                }
            />

            {customers.length === 0 && filters ? (
                <EmptyState
                    title="No Customers"
                    message="No customers match the current filters."
                />
            ) : customers.length === 0 && !filters ? (
                <EmptyState
                    title="No Customers"
                    message="There are no customers to display."
                    action={
                        <Link href="/customers/new">Add Customer</Link>
                    }
                />
            ) : (
                <CustomerList customers={customers} />
            )}

            <p>
                Page {page} of {Math.max(totalPages, 1)}{" "}
                {page > 1 && <Link href={pageHref(filters, page - 1)}>Previous</Link>}{" "}
                {page < totalPages && <Link href={pageHref(filters, page + 1)}>Next</Link>}
            </p>
        </main>
    );
}
