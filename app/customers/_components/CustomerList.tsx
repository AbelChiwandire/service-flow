"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import CustomerItem, { type Customer } from "./CustomerItem";

type CustomerResponse = {
  data: Customer[];
};

function isCustomer(value: unknown): value is Customer {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const customer = value as Record<string, unknown>;
  return (
    typeof customer.id === "string" &&
    typeof customer.name === "string" &&
    typeof customer.email === "string" &&
    typeof customer.phone === "string" &&
    typeof customer.address === "string"
  );
}

function isCustomerResponse(value: unknown): value is CustomerResponse {
  if (typeof value !== "object" || value === null || !("data" in value)) {
    return false;
  }

  const data = value.data;
  return Array.isArray(data) && data.every(isCustomer);
}

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  const loadCustomers = useCallback(async (signal: AbortSignal) => {
    try {
      const response = await fetch("/api/customers", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
        signal,
      });

      if (!response.ok) {
        throw new Error(
          `We couldn't load your customers (request failed with status ${response.status}).`,
        );
      }

      const payload: unknown = await response.json();
      if (!isCustomerResponse(payload)) {
        throw new Error("The customer service returned an unexpected response.");
      }

      setCustomers(payload.data);
    } catch (loadError: unknown) {
      if (signal.aborted) {
        return;
      }

      setError(
        loadError instanceof Error
          ? loadError.message
          : "We couldn't load your customers. Please try again.",
      );
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      void loadCustomers(controller.signal);
    });

    return () => controller.abort();
  }, [loadCustomers, reloadCount]);

  const retry = () => {
    setError(null);
    setIsLoading(true);
    setReloadCount((count) => count + 1);
  };

  if (isLoading) {
    return (
      <section
        aria-label="Customer list"
        aria-busy="true"
        className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm"
      >
        <div
          aria-hidden="true"
          className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#2667FF]"
        />
        <p role="status" className="mt-4 text-sm font-medium text-slate-600">
          Loading your customers…
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section
        aria-label="Customer list"
        className="rounded-xl border border-rose-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div role="alert">
          <h2 className="text-lg font-semibold text-slate-950">
            Customers couldn&apos;t be loaded
          </h2>
          <p className="mt-2 text-sm leading-6 text-rose-800">{error}</p>
        </div>
        <button
          type="button"
          onClick={retry}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#2667FF] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF] focus-visible:ring-offset-2"
        >
          Try again
        </button>
      </section>
    );
  }

  if (customers.length === 0) {
    return (
      <section
        aria-label="Customer list"
        className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm sm:px-10"
      >
        <div
          aria-hidden="true"
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#2667FF]/10 text-xl font-semibold text-[#3B28CC]"
        >
          +
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-950">
          No customers yet
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
          Add your first customer to start organizing your service work.
        </p>
        <Link
          href="/customers/new"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#2667FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF] focus-visible:ring-offset-2"
        >
          Add Customer
        </Link>
      </section>
    );
  }

  return (
    <section aria-label="Customer list">
      <p className="mb-4 text-sm text-slate-600">
        {customers.length} {customers.length === 1 ? "customer" : "customers"}
      </p>
      <ul className="grid list-none gap-4 p-0 md:grid-cols-2">
        {customers.map((customer) => (
          <CustomerItem key={customer.id} customer={customer} />
        ))}
      </ul>
    </section>
  );
}
