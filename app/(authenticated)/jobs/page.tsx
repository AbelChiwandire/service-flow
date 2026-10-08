// PLACEHOLDER PAGE
// This page uses a placeholder user ID until authentication is implemented.

import Link from 'next/link';
import {
    getJobs,
    getJobsTotalPages,
    type JobListParams,
} from '@/lib/db/dashboard/temp-jobs';
import {
    parseDue,
    parsePage,
    parseQuery,
    parseSort,
    parseStatus,
} from '@/lib/db/dashboard/search-params';
import { PLACEHOLDER_USER_ID } from '@/lib/auth/placeholder-session';

// An object whose keys are any strings and whose values are what Next.js gives per param.
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function pageHref(filters: JobListParams, page: number): string {
    const qs = new URLSearchParams();
    if (filters.query) qs.set('query', filters.query);
    if (filters.status) qs.set('status', filters.status);
    if (filters.due) qs.set('due', filters.due);
    if (filters.sort === 'desc') qs.set('sort', 'desc');
    qs.set('page', String(page));
    return `/jobs?${qs}`;
}

export default async function JobsPlaceholderPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const params = await searchParams;

    const filters: JobListParams = {
        query: parseQuery(params.query),
        page: parsePage(params.page),
        status: parseStatus(params.status),
        due: parseDue(params.due),
        sort: parseSort(params.sort),
    };

    const [jobs, totalPages] = await Promise.all([
        getJobs(PLACEHOLDER_USER_ID, filters),
        getJobsTotalPages(PLACEHOLDER_USER_ID, filters),
    ]);

    const page = filters.page ?? 1;

    return (
        <main>
            <h1>Jobs (placeholder)</h1>
            <p>
                Filters: status={filters.status ?? 'any'}, due={filters.due ?? 'any'},
                query=&quot;{filters.query}&quot;, sort={filters.sort}
            </p>

            {jobs.length === 0 ? (
                <p>No jobs match.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => (
                            <tr key={job.id}>
                                <td>{job.title}</td>
                                <td>{job.customerName}</td>
                                <td>{job.scheduledDate}</td>
                                <td>{job.status}</td>
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