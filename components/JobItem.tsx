import Link from "next/link";
import type { JobListItem } from "@/lib/db/jobs/repository";
import { JobStatusBadge } from "./JobStatusBadge";

// scheduledDate arrives as "YYYY-MM-DD"; format it in UTC so it never shifts a day.
function formatScheduledDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

export function JobItem({ job }: { job: JobListItem }) {
  return (
    <li className="flex flex-col gap-2 border-b border-slate-200 p-4 last:border-b-0 md:grid md:grid-cols-12 md:items-center md:gap-4">
      <div className="md:col-span-4">
        <Link
          href={`/jobs/${job.id}`}
          className="font-medium text-slate-900 transition-colors hover:text-[#2667FF]"
        >
          {job.title}
        </Link>
      </div>

      <p className="text-sm text-slate-600 md:col-span-3">{job.customerName}</p>

      <p className="text-sm text-slate-600 md:col-span-3">
        <span className="text-slate-500 md:hidden">Scheduled: </span>
        {formatScheduledDate(job.scheduledDate)}
      </p>

      <div className="md:col-span-2">
        <JobStatusBadge status={job.status} />
      </div>
    </li>
  );
}