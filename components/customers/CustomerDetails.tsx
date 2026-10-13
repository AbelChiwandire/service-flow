import Link from "next/link";
import type { Customer } from "@/lib/db/customer/repository";
import DeleteCustomerButton from "@/app/(authenticated)/customers/delete-customer-button";
import CustomerJobList from "@/components/customers/CustomerJobList";

const focusLinkClass =
  "rounded-sm text-sm font-semibold text-[#2667FF] underline-offset-4 hover:text-[#3F8EFC] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF] focus-visible:ring-offset-2";

export default function CustomerDetails({
  customer,
  userId,
}: {
  customer: Customer | null;
  userId: string;
}) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/customers" className={focusLinkClass}>
          <span aria-hidden="true" className="mr-2">
            ←
          </span>
          Back to Customers
        </Link>

        {!customer ? (
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
        ) : (
          <>
            <header className="mb-6 mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="mt-2 break-words text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  {customer.name}
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Customer details and service history.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/customers/${encodeURIComponent(customer.id)}/edit`}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#2667FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF] focus-visible:ring-offset-2"
                >
                  Edit Customer
                </Link>
                <DeleteCustomerButton
                  customerId={customer.id}
                />
              </div>
            </header>

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
        )}
      </div>
    </main>
  );
}
