"use client";

import { useActionState, useState } from "react";
import {
  changeJobStatusAction,
  completeJobAction,
  type StatusState,
} from "@/lib/db/jobs/actions";
import { JOB_STATUS_LABELS, JOB_STATUS_TRANSITIONS } from "@/lib/db/jobs/status";
import type { JobStatus } from "@/lib/db/jobs/repository";
import { ConfirmActionButton } from "./ConfirmActionButton";
import { Modal } from "./Modal";

const initialState: StatusState = { message: null, errors: {} };

const fieldClassName =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#2667FF] focus:outline-none focus:ring-1 focus:ring-[#2667FF]";

const primaryButtonClassName =
  "inline-flex h-10 items-center justify-center rounded-md bg-[#2667FF] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC] disabled:cursor-not-allowed disabled:opacity-50";

function StartJobButton({ jobId }: { jobId: string }) {
  const [state, formAction, isPending] = useActionState(
    changeJobStatusAction.bind(null, jobId, "in_progress"),
    initialState
  );

  return (
    <form action={formAction}>
      <button type="submit" disabled={isPending} className={primaryButtonClassName}>
        {isPending ? "Starting..." : "Start job"}
      </button>

      {state.message ? (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function CancelJobButton({ jobId }: { jobId: string }) {
  const [state, formAction, isPending] = useActionState(
    changeJobStatusAction.bind(null, jobId, "cancelled"),
    initialState
  );

  return (
    <ConfirmActionButton
      triggerLabel="Cancel job"
      title="Cancel this job?"
      description="A cancelled job can't be restarted. You can delete it afterwards."
      confirmLabel="Cancel job"
      pendingLabel="Cancelling..."
      destructive
      formAction={formAction}
      isPending={isPending}
      message={state.message}
    />
  );
}

function CompleteJobDialog({ jobId }: { jobId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    completeJobAction.bind(null, jobId),
    initialState
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={primaryButtonClassName}
      >
        Mark as completed
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Complete this job"
        description="Enter the invoice details. The job stays in progress until this is saved."
      >
        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="amount"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Invoice amount
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0.01"
              defaultValue={state.values?.amount ?? ""}
              required
              aria-describedby="amount-error"
              className={fieldClassName}
            />
            <div id="amount-error" aria-live="polite" aria-atomic="true">
              {state.errors?.amount?.map((error) => (
                <p key={error} className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Due date
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              defaultValue={state.values?.dueDate ?? ""}
              required
              aria-describedby="dueDate-error"
              className={fieldClassName}
            />
            <div id="dueDate-error" aria-live="polite" aria-atomic="true">
              {state.errors?.dueDate?.map((error) => (
                <p key={error} className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              ))}
            </div>
          </div>

          {state.message ? (
            <p role="alert" className="text-sm text-red-600">
              {state.message}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400"
            >
              Go back
            </button>

            <button type="submit" disabled={isPending} className={primaryButtonClassName}>
              {isPending ? "Saving..." : "Complete job"}
            </button>
          </div>
        </form>
      </Modal>
    </>
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
      {transitions.includes("in_progress") ? <StartJobButton jobId={jobId} /> : null}
      {transitions.includes("completed") ? <CompleteJobDialog jobId={jobId} /> : null}
      {transitions.includes("cancelled") ? <CancelJobButton jobId={jobId} /> : null}
    </div>
  );
}
