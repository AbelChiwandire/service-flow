"use client";

import { useActionState } from "react";
import { deleteJobAction, type State } from "@/lib/db/jobs/actions";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";

const initialState: State = { message: null, errors: {} };

export function DeleteJobButton({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [state, formAction, isPending] = useActionState(
    deleteJobAction.bind(null, jobId),
    initialState
  );

  return (
    <ConfirmActionButton
      triggerLabel="Delete job"
      title="Delete this job?"
      description={`This removes "${jobTitle}" from your list. This can't be undone.`}
      confirmLabel="Delete job"
      pendingLabel="Deleting..."
      destructive
      formAction={formAction}
      isPending={isPending}
      message={state.message}
    />
  );
}