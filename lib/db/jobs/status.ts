import type { JobStatus } from "./repository";

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  scheduled: "Scheduled",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

// Proposed MVP rules (the spec leaves exact transitions to the team):
// work moves forward, and completed/cancelled are final.
export const JOB_STATUS_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  scheduled: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export function canTransition(from: JobStatus, to: JobStatus): boolean {
  return JOB_STATUS_TRANSITIONS[from].includes(to);
}