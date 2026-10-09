import Link from "next/link";
import type { JobDetail } from "@/lib/db/jobs/queries";
import { formatDate } from "@/lib/format-date";
import { JobStatusBadge } from "./JobStatusBadge";

const termClassName = "text-sm font-medium text-slate-500";

export function JobDetails({ job }: { job: JobDetail }) {
  return (
    <dl className="grid gap-6 rounded-lg border border-slate-200 bg-white p-6 sm:grid-cols-2">
      <div>
        <dt className={termClassName}>Customer</dt>
        <dd className="mt-1 text-slate-900">
          <Link
            href={`/customers/${job.customerId}`}
            className="transition-colors hover:text-[#2667FF] hover:underline"
          >
            {job.customerName}
          </Link>
        </dd>
      </div>

      <div>
        <dt className={termClassName}>Status</dt>
        <dd className="mt-1">
          <JobStatusBadge status={job.status} />
        </dd>
      </div>

      <div>
        <dt className={termClassName}>Scheduled date</dt>
        <dd className="mt-1 text-slate-900">{formatDate(job.scheduledDate)}</dd>
      </div>

      <div className="sm:col-span-2">
        <dt className={termClassName}>Description</dt>
        <dd className="mt-1 whitespace-pre-line text-slate-900">
          {job.description ?? <span className="text-slate-500">No description.</span>}
        </dd>
      </div>
    </dl>
  );
}
