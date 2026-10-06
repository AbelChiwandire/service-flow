"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CustomerJobList from "./CustomerJobList";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

type CustomerResponse = {
  data: Customer;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCustomerResponse(value: unknown): value is CustomerResponse {
  if (!isRecord(value) || !isRecord(value.data)) {
    return false;
  }

  const customer = value.data;
  return (
    typeof customer.id === "string" &&
    typeof customer.name === "string" &&
    typeof customer.email === "string" &&
    typeof customer.phone === "string" &&
    typeof customer.address === "string"
  );
}

async function getErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const payload: unknown = await response.json();
    if (isRecord(payload)) {
      if (typeof payload.error === "string") {
        return payload.error;
      }
      if (isRecord(payload.error) && typeof payload.error.message === "string") {
        return payload.error.message;
      }
    }
  } catch {
    return fallback;
  }

  return fallback;
}

const focusLinkClass =
  "rounded-sm text-sm font-semibold text-[#2667FF] underline-offset-4 hover:text-[#3F8EFC] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF] focus-visible:ring-offset-2";

export default function CustomerDetails({
  customerId,
}: {
  customerId: string;
}) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        const message = await getErrorMessage(
          response,
          `We couldn't load this customer (request failed with status ${response.status}).`,
        );
        throw new Error(message);
      }

      const payload: unknown = await response.json();
      if (!isCustomerResponse(payload)) {
        throw new Error("The customer service returned an unexpected response.");
      }

      setCustomer(payload.data);
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

  const deleteCustomer = async () => {
    if (isDeleting || !window.confirm("Delete this customer? This action cannot be undone.")) {
      return;
    }

    setDeleteError(null);
    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/customers/${encodeURIComponent(customerId)}`,
        {
          method: "DELETE",
          credentials: "same-origin",
          headers: { Accept: "application/json" },
        },
      );

      if (response.status === 404) {
        setDeleteError("This customer could not be found. They may have already been deleted.");
        return;
      }
      if (!response.ok) {
        setDeleteError(
          await getErrorMessage(
            response,
            `We couldn't delete this customer (request failed with status ${response.status}).`,
          ),
        );
        return;
      }

      router.push("/customers");
    } catch {
      setDeleteError(
        "We couldn't reach the customer service. Check your connection and try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/customers" className={focusLinkClass}>
          <span aria-hidden="true" className="mr-2">
            ←
          </span>
          Back to Customers
        </Link>

        {isLoading ? (
          <section
            aria-label="Customer details"
            aria-busy="true"
            className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm"
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
          <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-2xl font-bold text-slate-950">
              Customer not found
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This customer may have been removed or is not available.
            </p>
            <Link
              href="/customers"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#2667FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF] focus-visible:ring-offset-2"
            >
              Back to Customers
            </Link>
          </section>
        ) : pageError ? (
          <section className="mt-6 rounded-xl border border-rose-300 bg-white p-6 shadow-sm sm:p-8">
            <div role="alert">
              <h1 className="text-2xl font-bold text-slate-950">
                Customer couldn&apos;t be loaded
              </h1>
              <p className="mt-2 text-sm leading-6 text-rose-900">{pageError}</p>
            </div>
          </section>
        ) : customer ? (
          <>
            <header className="mb-6 mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-wide text-[#3B28CC]">
                  ServiceFlow
                </p>
                <h1 className="mt-2 break-words text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  {customer.name}
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Customer details and service history.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/customers/${encodeURIComponent(customerId)}/edit`}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#2667FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF] focus-visible:ring-offset-2"
                >
                  Edit Customer
                </Link>
                <button
                  type="button"
                  onClick={deleteCustomer}
                  disabled={isDeleting}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-rose-300 bg-white px-5 py-2.5 text-sm font-semibold text-rose-800 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? "Deleting…" : "Delete Customer"}
                </button>
              </div>
            </header>

            {deleteError ? (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-950"
              >
                <p className="font-semibold">Customer could not be deleted.</p>
                <p className="mt-1">{deleteError}</p>
              </div>
            ) : null}

            <section
              aria-labelledby="customer-contact-heading"
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
            >
              <h2
                id="customer-contact-heading"
                className="text-lg font-semibold text-slate-950"
              >
                Contact information
              </h2>
              <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="min-w-0">
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Email
                  </dt>
                  <dd className="mt-1 break-words text-sm text-slate-800">
                    <a
                      href={`mailto:${customer.email}`}
                      className="underline decoration-slate-300 underline-offset-4 hover:text-[#2667FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF]"
                    >
                      {customer.email}
                    </a>
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Phone
                  </dt>
                  <dd className="mt-1 break-words text-sm text-slate-800">
                    <a
                      href={`tel:${customer.phone}`}
                      className="underline decoration-slate-300 underline-offset-4 hover:text-[#2667FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF]"
                    >
                      {customer.phone}
                    </a>
                  </dd>
                </div>
                <div className="min-w-0 sm:col-span-2">
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Address
                  </dt>
                  <dd className="mt-1 break-words text-sm leading-6 text-slate-800">
                    {customer.address}
                  </dd>
                </div>
              </dl>
            </section>

            <CustomerJobList customer={customer} />
          </>
        ) : null}
      </div>
    </main>
  );
}
