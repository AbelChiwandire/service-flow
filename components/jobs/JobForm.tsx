"use client";

import type { State } from "@/lib/db/jobs/actions";
import {
  FieldErrors,
  FormActions,
  fieldClassName,
  invalidFieldClassName,
  labelClassName,
} from "@/components/shared/form";
import { useFormFeedback } from "@/components/shared/useFormFeedback";

const FIELDS = ["customerId", "title", "description", "scheduledDate"] as const;
type FieldName = (typeof FIELDS)[number];

type JobFormProps = {
  formAction: (formData: FormData) => void;
  state: State;
  isPending: boolean;
  submitLabel: string;
  cancelHref: string;
  // When provided, the form shows a customer picker (used when creating a job).
  customers?: { id: string; name: string }[];
  initialValues?: {
    customerId?: string;
    title?: string;
    description?: string | null;
    scheduledDate?: string;
  };
};

export function JobForm({
  formAction,
  state,
  isPending,
  submitLabel,
  cancelHref,
  customers,
  initialValues,
}: JobFormProps) {
  const customerId = state.values?.customerId ?? initialValues?.customerId ?? "";
  const title = state.values?.title ?? initialValues?.title ?? "";
  const description = state.values?.description ?? initialValues?.description ?? "";
  const scheduledDate = state.values?.scheduledDate ?? initialValues?.scheduledDate ?? "";
  const { getFieldErrors, clearFieldError, resetFeedback, isMessageDismissed } =
    useFormFeedback(state, FIELDS);
  const inputClassName = (field: FieldName) =>
    `${fieldClassName} ${getFieldErrors(field)?.length ? invalidFieldClassName : ""}`;

  return (
    <form
      action={formAction}
      aria-busy={isPending}
      onSubmit={resetFeedback}
      className="space-y-5"
    >
      {customers ? (
        <div>
          <label htmlFor="customerId" className={labelClassName}>
            Customer
          </label>
          <select
            id="customerId"
            name="customerId"
            defaultValue={customerId}
            required
            onChange={() => clearFieldError("customerId")}
            aria-invalid={Boolean(getFieldErrors("customerId")?.length)}
            aria-describedby="customerId-error"
            className={inputClassName("customerId")}
          >
            <option value="" disabled>
              Select a customer
            </option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
          <FieldErrors id="customerId" errors={getFieldErrors("customerId")} />
        </div>
      ) : null}

      <div>
        <label htmlFor="title" className={labelClassName}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={title}
          required
          maxLength={255}
          onChange={() => clearFieldError("title")}
          aria-invalid={Boolean(getFieldErrors("title")?.length)}
          aria-describedby="title-error"
          className={inputClassName("title")}
        />
        <FieldErrors id="title" errors={getFieldErrors("title")} />
      </div>

      <div>
        <label htmlFor="description" className={labelClassName}>
          Description <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={description}
          rows={4}
          onChange={() => clearFieldError("description")}
          aria-invalid={Boolean(getFieldErrors("description")?.length)}
          aria-describedby="description-error"
          className={inputClassName("description")}
        />
        <FieldErrors id="description" errors={getFieldErrors("description")} />
      </div>

      <div>
        <label htmlFor="scheduledDate" className={labelClassName}>
          Scheduled date
        </label>
        <input
          id="scheduledDate"
          name="scheduledDate"
          type="date"
          defaultValue={scheduledDate}
          required
          onChange={() => clearFieldError("scheduledDate")}
          aria-invalid={Boolean(getFieldErrors("scheduledDate")?.length)}
          aria-describedby="scheduledDate-error"
          className={inputClassName("scheduledDate")}
        />
        <FieldErrors id="scheduledDate" errors={getFieldErrors("scheduledDate")} />
      </div>

      {state.message && !isMessageDismissed ? (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      ) : null}

      <FormActions cancelHref={cancelHref} submitLabel={submitLabel} isPending={isPending} />
    </form>
  );
}
