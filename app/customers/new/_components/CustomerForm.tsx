"use client";

import { type FormEvent, useRef, useState } from "react";
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
type ApiError = {
  message: string;
  fieldErrors: FieldErrors;
};

const fieldLabels: Record<FieldName, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  address: "Address",
};

const initialValues: CustomerFields = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFieldName(value: string): value is FieldName {
  return value in fieldLabels;
}

function getValidationErrors(value: unknown): FieldErrors {
  if (Array.isArray(value)) {
    const result: FieldErrors = {};
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
      if (field && isFieldName(field) && !result[field]) {
        result[field] = detail.message;
      }
    }
    return result;
  }

  if (!isRecord(value)) {
    return {};
  }

  const result: FieldErrors = {};
  for (const [field, message] of Object.entries(value)) {
    if (!isFieldName(field)) {
      continue;
    }

    if (typeof message === "string") {
      result[field] = message;
    } else if (Array.isArray(message)) {
      const firstMessage = message.find(
        (entry): entry is string => typeof entry === "string",
      );
      if (firstMessage) {
        result[field] = firstMessage;
      }
    }
  }
  return result;
}

function getApiError(payload: unknown): ApiError {
  if (!isRecord(payload)) {
    return {
      message: "We couldn't create the customer. Please try again.",
      fieldErrors: {},
    };
  }

  const error = payload.error;
  const errorRecord = isRecord(error) ? error : undefined;
  const message =
    (typeof error === "string" && error) ||
    (errorRecord && typeof errorRecord.message === "string"
      ? errorRecord.message
      : undefined) ||
    "We couldn't create the customer. Please check the information and try again.";

  const details =
    (errorRecord && (errorRecord.details ?? errorRecord.errors)) ??
    payload.details ??
    payload.errors;

  return {
    message,
    fieldErrors: getValidationErrors(details),
  };
}

function validate(values: CustomerFields): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.name) {
    errors.name = "Enter the customer's name.";
  }
  if (!values.email) {
    errors.email = "Enter the customer's email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address, such as name@example.com.";
  }
  if (!values.phone) {
    errors.phone = "Enter the customer's phone number.";
  }
  if (!values.address) {
    errors.address = "Enter the customer's address.";
  }

  return errors;
}

const inputClassName =
  "mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2667FF] focus:ring-2 focus:ring-[#2667FF]/20";
const labelClassName = "block text-sm font-semibold text-slate-800";

export default function CustomerForm() {
  const router = useRouter();
  const submissionInProgress = useRef(false);
  const [values, setValues] = useState<CustomerFields>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: FieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
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
    if (submissionInProgress.current) {
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
      document
        .getElementById(Object.keys(validationErrors)[0])
        ?.focus();
      return;
    }

    submissionInProgress.current = true;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(customer),
      });

      const payload: unknown = await response.json();
      if (!response.ok) {
        const apiError = getApiError(payload);
        setFieldErrors(apiError.fieldErrors);
        setRequestError(apiError.message);
        return;
      }

      const data = isRecord(payload) && isRecord(payload.data)
        ? payload.data
        : undefined;
      const createdCustomer =
        data && isRecord(data.customer) ? data.customer : data;
      const customerId =
        createdCustomer && typeof createdCustomer.id === "string"
          ? createdCustomer.id
          : undefined;

      if (!customerId) {
        setRequestError(
          "The customer was submitted, but the response did not include a customer ID. Please check your customer list before trying again.",
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
            className={`${inputClassName} ${
              fieldErrors.name
                ? "border-rose-700 focus:border-rose-700 focus:ring-rose-700/20"
                : ""
            }`}
          />
          {fieldErrors.name ? (
            <p id="name-error" className="mt-1.5 text-sm text-rose-800">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className={labelClassName}>
            Email <span aria-hidden="true" className="text-rose-700">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            className={`${inputClassName} ${
              fieldErrors.email
                ? "border-rose-700 focus:border-rose-700 focus:ring-rose-700/20"
                : ""
            }`}
          />
          {fieldErrors.email ? (
            <p id="email-error" className="mt-1.5 text-sm text-rose-800">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className={labelClassName}>
            Phone <span aria-hidden="true" className="text-rose-700">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
            className={`${inputClassName} ${
              fieldErrors.phone
                ? "border-rose-700 focus:border-rose-700 focus:ring-rose-700/20"
                : ""
            }`}
          />
          {fieldErrors.phone ? (
            <p id="phone-error" className="mt-1.5 text-sm text-rose-800">
              {fieldErrors.phone}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="address" className={labelClassName}>
            Address <span aria-hidden="true" className="text-rose-700">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            autoComplete="street-address"
            required
            rows={3}
            value={values.address}
            onChange={(event) => updateField("address", event.target.value)}
            aria-invalid={Boolean(fieldErrors.address)}
            aria-describedby={
              fieldErrors.address ? "address-error" : undefined
            }
            className={`${inputClassName} min-h-28 resize-y ${
              fieldErrors.address
                ? "border-rose-700 focus:border-rose-700 focus:ring-rose-700/20"
                : ""
            }`}
          />
          {fieldErrors.address ? (
            <p id="address-error" className="mt-1.5 text-sm text-rose-800">
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
          <p className="font-semibold">Customer could not be created.</p>
          <p className="mt-1">{requestError}</p>
        </div>
      ) : null}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
        <Link
          href="/customers"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF] focus-visible:ring-offset-2"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#2667FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving customer…" : "Save customer"}
        </button>
      </div>
    </form>
  );
}
