"use client";

import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CustomerFields = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

type FieldName = keyof CustomerFields;
type FieldErrors = Partial<Record<FieldName, string>>;

const fieldNames: FieldName[] = ["name", "email", "phone", "address"];
const inputClassName =
  "mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2667FF] focus:ring-2 focus:ring-[#2667FF]/20";
const labelClassName = "block text-sm font-semibold text-slate-800";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCustomerResponse(
  value: unknown,
): value is { data: CustomerFields } {
  if (!isRecord(value) || !isRecord(value.data)) {
    return false;
  }

  const customer = value.data;
  return fieldNames.every((field) => typeof customer[field] === "string");
}

function getFieldErrors(value: unknown): FieldErrors {
  const errors: FieldErrors = {};

  if (Array.isArray(value)) {
    for (const detail of value) {
      if (!isRecord(detail) || typeof detail.message !== "string") {
        continue;
      }

      const field =
        typeof detail.field === "string"
          ? detail.field
          : Array.isArray(detail.path) && typeof detail.path[0] === "string"
            ? detail.path[0]
            : typeof detail.path === "string"
              ? detail.path
              : undefined;
      if (
        field &&
        fieldNames.includes(field as FieldName) &&
        !errors[field as FieldName]
      ) {
        errors[field as FieldName] = detail.message;
      }
    }
    return errors;
  }

  if (!isRecord(value)) {
    return errors;
  }

  for (const field of fieldNames) {
    const message = value[field];
    if (typeof message === "string") {
      errors[field] = message;
    } else if (Array.isArray(message)) {
      const firstMessage = message.find(
        (entry): entry is string => typeof entry === "string",
      );
      if (firstMessage) {
        errors[field] = firstMessage;
      }
    }
  }

  return errors;
}

function getApiError(payload: unknown) {
  if (!isRecord(payload)) {
    return {
      message: "We couldn't save your changes. Please try again.",
      fieldErrors: {},
    };
  }

  const error = payload.error;
  const errorObject = isRecord(error) ? error : undefined;
  const message =
    (typeof error === "string" && error) ||
    (errorObject && typeof errorObject.message === "string"
      ? errorObject.message
      : undefined) ||
    "We couldn't save your changes. Please check the information and try again.";
  const details =
    (errorObject && (errorObject.details ?? errorObject.errors)) ??
    payload.details ??
    payload.errors;

  return { message, fieldErrors: getFieldErrors(details) };
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (isRecord(payload)) {
    if (typeof payload.error === "string") {
      return payload.error;
    }
    if (isRecord(payload.error) && typeof payload.error.message === "string") {
      return payload.error.message;
    }
  }
  return fallback;
}

function validate(values: CustomerFields): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.name) {
    errors.name = "Enter the customer's name.";
  }
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address, such as name@example.com.";
  }

  return errors;
}

export default function EditCustomerForm({
  customerId,
}: {
  customerId: string;
}) {
  const router = useRouter();
  const submissionInProgress = useRef(false);
  const [values, setValues] = useState<CustomerFields | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCustomer = useCallback(async (signal: AbortSignal) => {
    try {
      const response = await fetch(
        `/api/customers/${encodeURIComponent(customerId)}`,
        {
          method: "GET",
          cache: "no-store",
          credentials: "same-origin",
          signal,
        },
      );

      if (response.status === 404) {
        setNotFound(true);
        return;
      }
      if (!response.ok) {
        let payload: unknown;
        try {
          payload = await response.json();
        } catch {
          payload = null;
        }
        throw new Error(
          getErrorMessage(
            payload,
            `We couldn't load this customer (request failed with status ${response.status}).`,
          ),
        );
      }

      const payload: unknown = await response.json();
      if (!isCustomerResponse(payload)) {
        throw new Error("The customer service returned an unexpected response.");
      }

      setValues({
        name: payload.data.name,
        email: payload.data.email,
        phone: payload.data.phone,
        address: payload.data.address,
      });
    } catch (error: unknown) {
      if (!signal.aborted) {
        setPageError(
          error instanceof Error
            ? error.message
            : "We couldn't load this customer. Please try again.",
        );
      }
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [customerId]);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      void loadCustomer(controller.signal);
    });

    return () => controller.abort();
  }, [loadCustomer]);

  const updateField = (field: FieldName, value: string) => {
    setValues((current) => (current ? { ...current, [field]: value } : current));
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }
      const next = { ...current };
      delete next[field];
      return next;
    });
    setRequestError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!values || submissionInProgress.current) {
      return;
    }

    const customer: CustomerFields = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
    };
    const validationErrors = validate(customer);
    setFieldErrors(validationErrors);
    setRequestError(null);

    if (Object.keys(validationErrors).length > 0) {
      document.getElementById(Object.keys(validationErrors)[0])?.focus();
      return;
    }

    submissionInProgress.current = true;
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/customers/${encodeURIComponent(customerId)}`,
        {
          method: "PATCH",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(customer),
        },
      );

      let payload: unknown;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (response.status === 404) {
        setNotFound(true);
        return;
      }
      if (!response.ok) {
        const apiError = getApiError(payload);
        setFieldErrors(apiError.fieldErrors);
        setRequestError(apiError.message);
        return;
      }
      if (!isCustomerResponse(payload)) {
        setRequestError(
          "Your changes were submitted, but the customer service returned an unexpected response.",
        );
        return;
      }

      router.push(`/customers/${encodeURIComponent(customerId)}`);
    } catch {
      setRequestError(
        "We couldn't reach the customer service. Check your connection and try again.",
      );
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/customers/${encodeURIComponent(customerId)}`}
          className="inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-[#2667FF] underline-offset-4 hover:text-[#3F8EFC] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF] focus-visible:ring-offset-2"
        >
          <span aria-hidden="true" className="mr-2">
            ←
          </span>
          Back to customer
        </Link>

        <header className="mb-8 mt-6">
          <p className="text-sm font-semibold tracking-wide text-[#3B28CC]">
            ServiceFlow
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Edit customer
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Update this customer&apos;s contact information.
          </p>
        </header>

        {isLoading ? (
          <section
            aria-busy="true"
            className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm"
          >
            <div
              aria-hidden="true"
              className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#2667FF]"
            />
            <p role="status" className="mt-4 text-sm font-medium text-slate-600">
              Loading customer…
            </p>
          </section>
        ) : notFound ? (
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-slate-950">
              Customer not found
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This customer may have been removed or is not available.
            </p>
          </section>
        ) : pageError ? (
          <section className="rounded-xl border border-rose-300 bg-white p-6 shadow-sm sm:p-8">
            <div role="alert">
              <h2 className="text-xl font-semibold text-slate-950">
                Customer couldn&apos;t be loaded
              </h2>
              <p className="mt-2 text-sm leading-6 text-rose-900">{pageError}</p>
            </div>
          </section>
        ) : values ? (
          <form
            noValidate
            onSubmit={handleSubmit}
            aria-busy={isSubmitting}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClassName}>
                  Name <span aria-hidden="true" className="text-rose-700">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={values.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                  className={`${inputClassName} ${fieldErrors.name ? "border-rose-700 focus:border-rose-700 focus:ring-rose-700/20" : ""}`}
                />
                {fieldErrors.name ? (
                  <p id="name-error" className="mt-1.5 text-sm text-rose-800">
                    {fieldErrors.name}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="email" className={labelClassName}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  className={`${inputClassName} ${fieldErrors.email ? "border-rose-700 focus:border-rose-700 focus:ring-rose-700/20" : ""}`}
                />
                {fieldErrors.email ? (
                  <p id="email-error" className="mt-1.5 text-sm text-rose-800">
                    {fieldErrors.email}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="phone" className={labelClassName}>
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                  className={`${inputClassName} ${fieldErrors.phone ? "border-rose-700 focus:border-rose-700 focus:ring-rose-700/20" : ""}`}
                />
                {fieldErrors.phone ? (
                  <p id="phone-error" className="mt-1.5 text-sm text-rose-800">
                    {fieldErrors.phone}
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className={labelClassName}>
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  rows={3}
                  value={values.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  aria-invalid={Boolean(fieldErrors.address)}
                  aria-describedby={
                    fieldErrors.address ? "address-error" : undefined
                  }
                  className={`${inputClassName} min-h-28 resize-y ${fieldErrors.address ? "border-rose-700 focus:border-rose-700 focus:ring-rose-700/20" : ""}`}
                />
                {fieldErrors.address ? (
                  <p
                    id="address-error"
                    className="mt-1.5 text-sm text-rose-800"
                  >
                    {fieldErrors.address}
                  </p>
                ) : null}
              </div>
            </div>

            {requestError ? (
              <div
                role="alert"
                className="mt-6 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-950"
              >
                <p className="font-semibold">Changes could not be saved.</p>
                <p className="mt-1">{requestError}</p>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                href={`/customers/${encodeURIComponent(customerId)}`}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF] focus-visible:ring-offset-2"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#2667FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Saving changes…" : "Save changes"}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </main>
  );
}
