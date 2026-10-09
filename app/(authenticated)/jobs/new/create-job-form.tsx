"use client";

import { useActionState } from "react";
import { createJobAction, type State } from "@/lib/db/jobs/actions";
import type { CustomerOption } from "@/lib/db/jobs/queries";
import { JobForm } from "@/components/JobForm";

const initialState: State = { message: null, errors: {} };

type CreateJobFormProps = {
  customers: CustomerOption[];
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
