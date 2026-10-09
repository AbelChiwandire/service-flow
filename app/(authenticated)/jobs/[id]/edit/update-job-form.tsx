"use client";

import { useActionState } from "react";
import { updateJobAction, type State } from "@/lib/db/jobs/actions";
import { JobForm } from "@/components/JobForm";

const initialState: State = { message: null, errors: {} };

type UpdateJobFormProps = {
  jobId: string;
  initialValues: {
    title: string;
    description: string | null;
    scheduledDate: string;
  };
};

export default function UpdateJobForm({ jobId, initialValues }: UpdateJobFormProps) {
  const boundUpdateJobAction = updateJobAction.bind(null, jobId);
  const [state, formAction, isPending] = useActionState(
    boundUpdateJobAction,
    initialState
  );

  return (
    <JobForm
      formAction={formAction}
      state={state}
      isPending={isPending}
      submitLabel="Save changes"
      cancelHref="/jobs"
      initialValues={initialValues}
    />
  );
}
