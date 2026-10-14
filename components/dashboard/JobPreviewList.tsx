import Link from "next/link";
import type { DashboardJob } from "@/lib/db/dashboard/repository";

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

    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
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
        <section className="card-surface">
            <div className="panel-header">
                <h2 className="heading-h2">{title}</h2>

                {total > 0 && (
                    <Link
                        href={viewAllHref}
                        className="shrink-0 text-sm font-medium text-navy hover:text-navy-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
                    >
                        View all ({total})
                    </Link>
                )}
            </div>

            {jobs.length === 0 ? (
                <p className="px-4 py-6 small-text sm:px-6">{emptyText}</p>
            ) : (
                <ul className="list-divided">
                    {jobs.map((job) => (
                        <li key={job.id}>
                            <Link
                                href={`/jobs/${encodeURIComponent(job.id)}`}
                                className="list-row-link"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-foreground">
                                        {job.title}
                                    </p>
                                    <p className="mt-1 truncate small-text">
                                        {job.customerName}
                                    </p>
                                </div>

                                <p className="shrink-0 text-right sm:text-sm caption-text">
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
