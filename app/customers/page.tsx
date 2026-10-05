import Link from 'next/link';
import {
    getCustomers,
    getCustomersTotalPages,
    type CustomerListParams,
} from '@/lib/db/dashboard/temp-customers';
import {
    parseCustomerFilter,
    parsePage,
    parseQuery,
} from '@/lib/db/dashboard/search-params';

// Use the same placeholder user id as the rest of the app (auth is deferred).
const USER_ID = 'ce21113f-f450-4006-abb3-e5f1c67ceabb';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function pageHref(filters: CustomerListParams, page: number): string {
    const qs = new URLSearchParams();
    if (filters.query) qs.set('query', filters.query);
    if (filters.filter) qs.set('filter', filters.filter);
    qs.set('page', String(page));
    return `/customers?${qs}`;
}

export default async function CustomersPlaceholderPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const params = await searchParams;

    const filters: CustomerListParams = {
        query: parseQuery(params.query),
        page: parsePage(params.page),
        filter: parseCustomerFilter(params.filter),
    };

    const [customers, totalPages] = await Promise.all([
        getCustomers(USER_ID, filters),
        getCustomersTotalPages(USER_ID, filters),
    ]);

    const page = filters.page ?? 1;

    return (
        <main>
            <h1>Customers (placeholder)</h1>
            <p>
                Filters: filter={filters.filter ?? 'none'}, query=&quot;{filters.query}&quot;
            </p>

            {customers.length === 0 ? (
                <p>No customers match.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.phone}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <p>
                Page {page} of {Math.max(totalPages, 1)}{' '}
                {page > 1 && <Link href={pageHref(filters, page - 1)}>Previous</Link>}{' '}
                {page < totalPages && (
                    <Link href={pageHref(filters, page + 1)}>Next</Link>
                )}
            </p>
        </main>
    );
}