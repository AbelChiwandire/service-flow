import Link from "next/link";
import type { JobWithCustomer } from "@/lib/db/jobs/repository";
import { DataRow } from "@/components/shared/DataTable";
import { JobStatusBadge } from "./JobStatusBadge";

// scheduledDate arrives as "YYYY-MM-DD"; format it in UTC so it never shifts a day.
function formatScheduledDate(isoDate: string): string {
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeZone: "UTC",
    }).format(new Date(`${isoDate}T00:00:00Z`));
}

export function JobItem({ job }: { job: JobWithCustomer }) {
    return (
        <DataRow>
            <div className="md:col-span-4">
                <Link href={`/jobs/${job.id}`} className="link-subtle">
                    {job.title}
                </Link>
            </div>

            <p className="md:col-span-3 small-text">
                <Link href={`/customers/${job.customerId}`} className="link-inline">
                    {job.customerName}
                </Link>
            </p>

            <p className="md:col-span-3 small-text">
                <span className="text-foreground md:hidden">Scheduled: </span>
                {formatScheduledDate(job.scheduledDate)}
            </p>

            <div className="md:col-span-2">
                <JobStatusBadge status={job.status} />
            </div>
        </DataRow>
    );
}
