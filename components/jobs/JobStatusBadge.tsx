import type { JobStatus } from "@/lib/db/jobs/repository";

const statusStyles: Record<JobStatus, { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "bg-blue-50 text-[#2667FF]" },
  in_progress: { label: "In Progress", className: "bg-indigo-50 text-[#3B28CC]" },
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700" },
  cancelled: { label: "Cancelled", className: "bg-slate-100 text-slate-600" },
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const { label, className } = statusStyles[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}