"use client";

import Link from "next/link";
import type { State } from "@/lib/db/jobs/actions";

const fieldClassName =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#2667FF] focus:outline-none focus:ring-1 focus:ring-[#2667FF]";

const labelClassName = "mb-1 block text-sm font-medium text-slate-700";

function FieldErrors({ id, errors }: { id: string; errors?: string[] }) {
  return (
    <div id={`${id}-error`} aria-live="polite" aria-atomic="true">
      {errors?.map((error) => (
        <p key={error} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      ))}
    </div>
  );
}

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

  return (
    <form action={formAction} className="space-y-5">
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
            aria-describedby="customerId-error"
            className={fieldClassName}
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
          <FieldErrors id="customerId" errors={state.errors?.customerId} />
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
          aria-describedby="title-error"
          className={fieldClassName}
        />
        <FieldErrors id="title" errors={state.errors?.title} />
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
          aria-describedby="description-error"
          className={fieldClassName}
        />
        <FieldErrors id="description" errors={state.errors?.description} />
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
          aria-describedby="scheduledDate-error"
          className={fieldClassName}
        />
        <FieldErrors id="scheduledDate" errors={state.errors?.scheduledDate} />
      </div>

      {state.message ? (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href={cancelHref}
          className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center rounded-md bg-[#2667FF] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
