import type { JobStatus } from "@/lib/db/jobs/repository";

const statusStyles: Record<JobStatus, { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "badge-gray" },
  in_progress: { label: "In Progress", className: "badge-navy" },
  completed: { label: "Completed", className: "badge-green" },
  cancelled: { label: "Cancelled", className: "badge-maroon" },
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const { label, className } = statusStyles[status];

  return (
    <span
      className={`badge ${className}`}
    >
      {label}
    </span>
  );
}