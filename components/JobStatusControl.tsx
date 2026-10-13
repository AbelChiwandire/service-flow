"use client";

import { useActionState } from "react";
import { changeJobStatusAction, type StatusState } from "@/lib/db/jobs/actions";
import { JOB_STATUS_LABELS, JOB_STATUS_TRANSITIONS } from "@/lib/db/jobs/status";
import type { JobStatus } from "@/lib/db/jobs/repository";
import { ConfirmActionButton } from "./ConfirmActionButton";

const initialState: StatusState = { message: null };

type StatusActionConfig = {
  label: string;
  pendingLabel: string;
  // Actions that can't be undone ask for confirmation first.
  confirm?: { title: string; description: string; destructive?: boolean };
};

const STATUS_ACTIONS: Partial<Record<JobStatus, StatusActionConfig>> = {
  in_progress: {
    label: "Start job",
    pendingLabel: "Starting...",
  },
  completed: {
    label: "Mark as completed",
    pendingLabel: "Completing...",
    confirm: {
      title: "Mark this job as completed?",
      description:
        "A completed job can't be changed back. You can delete it afterwards.",
    },
  },
  cancelled: {
    label: "Cancel job",
    pendingLabel: "Cancelling...",
    confirm: {
      title: "Cancel this job?",
      description: "A cancelled job can't be restarted. You can delete it afterwards.",
      destructive: true,
    },
  },
};

function StatusAction({
  jobId,
  target,
  config,
}: {
  jobId: string;
  target: JobStatus;
  config: StatusActionConfig;
}) {
  const [state, formAction, isPending] = useActionState(
    changeJobStatusAction.bind(null, jobId, target),
    initialState
  );

  if (config.confirm) {
    return (
      <ConfirmActionButton
        triggerLabel={config.label}
        title={config.confirm.title}
        description={config.confirm.description}
        confirmLabel={config.label}
        pendingLabel={config.pendingLabel}
        destructive={config.confirm.destructive}
        formAction={formAction}
        isPending={isPending}
        message={state.message}
      />
    );
  }

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-10 items-center justify-center rounded-md bg-[#2667FF] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? config.pendingLabel : config.label}
      </button>

      {state.message ? (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

export function JobStatusControl({
  jobId,
  status,
}: {
  jobId: string;
  status: JobStatus;
}) {
  const transitions = JOB_STATUS_TRANSITIONS[status];

  if (transitions.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        This job is {JOB_STATUS_LABELS[status].toLowerCase()}, so its status can&apos;t
        be changed.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-start gap-3">
      {transitions.map((target) => {
        const config = STATUS_ACTIONS[target];
        return config ? (
          <StatusAction key={target} jobId={jobId} target={target} config={config} />
        ) : null;
      })}
    </div>
  );
}
