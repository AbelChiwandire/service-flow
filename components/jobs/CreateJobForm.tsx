"use client";

import { useActionState } from "react";
import { createJobAction, type State } from "@/lib/db/jobs/actions";
import { JobForm } from "@/components/jobs/JobForm";

const initialState: State = { message: null, errors: {} };

type CreateJobFormProps = {
  customers: { id: string; name: string }[];
  defaultCustomerId?: string;
};

export default function CreateJobForm({
  customers,
  defaultCustomerId,
}: CreateJobFormProps) {
  const [state, formAction, isPending] = useActionState(
    createJobAction,
    initialState
  );

  return (
    <JobForm
      formAction={formAction}
      state={state}
      isPending={isPending}
      submitLabel="Create job"
      cancelHref="/jobs"
      customers={customers}
      initialValues={{ customerId: defaultCustomerId }}
    />
  );
}
