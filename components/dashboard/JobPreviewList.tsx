import Link from 'next/link';
import type { DashboardJob } from '@/lib/db/dashboard/repository';

interface JobPreviewListProps {
    title: string;
    jobs: DashboardJob[];
    total: number;
    viewAllHref: string;
    emptyText: string;
}

// A DATE column can arrive as a Date (local midnight) or a 'YYYY-MM-DD' string.
// Adding 'T00:00:00' with no 'Z' makes JavaScript read the string as local time,
// so the day never shifts.
function formatJobDate(value: string): string {
    const date = new Date(`${value.slice(0, 10)}T00:00:00`);

    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function JobPreviewList({
    title,
    jobs,
    total,
    viewAllHref,
    emptyText,
}: JobPreviewListProps) {
    return (
        <section className="rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-4 sm:px-5">
                <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                    {title}
                </h2>

                {total > 0 && (
                    <Link
                        href={viewAllHref}
                        className="shrink-0 text-sm font-medium text-primary hover:text-primary-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                        View all ({total})
                    </Link>
                )}
            </div>

            {jobs.length === 0 ? (
                <p className="px-4 py-6 text-sm text-slate-500 sm:px-5">
                    {emptyText}
                </p>
            ) : (
                <ul className="divide-y divide-slate-100">
                    {jobs.map((job) => (
                        <li key={job.id}>
                            <Link
                                href={`/jobs/${encodeURIComponent(job.id)}`}
                                className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:px-5"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-slate-900">
                                        {job.title}
                                    </p>
                                    <p className="mt-0.5 truncate text-sm text-slate-600">
                                        {job.customerName}
                                    </p>
                                </div>

                                <p className="shrink-0 text-right text-xs text-slate-500 sm:text-sm">
                                    {formatJobDate(job.scheduledDate)}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}