import Link from "next/link";
import CustomerItem, { type Customer } from "./CustomerItem";

export default function CustomerList({
  customers,
}: {
  customers: Customer[];
}) {
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
