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
function formatJobDate(value: Date | string): string {
    const date =
        typeof value === 'string'
            ? new Date(`${value.slice(0, 10)}T00:00:00`)
            : value;
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
        <section className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-lg font-semibold">{title}</h2>
                {total > 0 && (
                    <Link
                        href={viewAllHref}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        View all ({total})
                    </Link>
                )}
            </div>

            {jobs.length === 0 ? (
                <p className="text-sm text-gray-500">{emptyText}</p>
            ) : (
                <ul className="divide-y divide-gray-100">
                    {jobs.map((job) => (
                        <li key={job.id}>
                            <Link
                                href={`/jobs/${job.id}`}
                                className="flex items-center justify-between gap-4 py-2 hover:bg-gray-50"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium">{job.title}</p>
                                    <p className="truncate text-sm text-gray-600">
                                        {job.customerName}
                                    </p>
                                </div>
                                <p className="shrink-0 text-sm text-gray-600">
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