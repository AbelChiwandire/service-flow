import Link from "next/link";
import type { JobWithCustomer } from "@/lib/db/jobs/repository";
import { formatDate } from "@/lib/format-date";
import { JobStatusBadge } from "./JobStatusBadge";

export function JobDetails({ job }: { job: JobWithCustomer }) {
    return (
        <dl className="details-grid">
            <div>
                <dt className="label-text">Customer</dt>
                <dd className="mt-1 text-foreground">
                    <Link href={`/customers/${job.customerId}`} className="link-inline">
                        {job.customerName}
                    </Link>
                </dd>
            </div>

            <div>
                <dt className="label-text">Status</dt>
                <dd className="mt-1">
                    <JobStatusBadge status={job.status} />
                </dd>
            </div>

            <div>
                <dt className="label-text">Scheduled date</dt>
                <dd className="mt-1 text-foreground">{formatDate(job.scheduledDate)}</dd>
            </div>

            <div className="sm:col-span-2">
                <dt className="label-text">Description</dt>
                <dd className="mt-1 whitespace-pre-line text-foreground">
                    {job.description ?? <span className="text-foreground">No description.</span>}
                </dd>
            </div>
        </dl>
    );
}
