import type { JobListItem } from "@/lib/db/jobs/repository";
import { JobItem } from "./JobItem";

export function JobList({ jobs }: { jobs: JobListItem[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div
        aria-hidden="true"
        className="hidden grid-cols-12 gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid"
      >
        <span className="col-span-4">Job</span>
        <span className="col-span-3">Customer</span>
        <span className="col-span-3">Scheduled</span>
        <span className="col-span-2">Status</span>
      </div>

      <ul>
        {jobs.map((job) => (
          <JobItem key={job.id} job={job} />
        ))}
      </ul>
    </div>
  );
}
