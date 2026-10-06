import Link from "next/link";
import CustomerList from "./_components/CustomerList";

export default function CustomersPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-wide text-[#3B28CC]">
              ServiceFlow
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Customers
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Manage your customer information and keep every relationship in
              one place.
            </p>
          </div>
          <Link
            href="/customers/new"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#2667FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3F8EFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF] focus-visible:ring-offset-2"
          >
            Add Customer
          </Link>
        </header>

        <CustomerList />
      </div>
    </main>
  );
}
/*
// PLACEHOLDER TEST PAGE — just testing the customer CRUD flow
// (create/update/delete + PLACEHOLDER_USER_ID) end to end before auth exists.
// Not final UI. 
// Replace with actual customers page and components

import Link from 'next/link';
import { getCustomers } from '@/lib/db/customer/repository';
import { PLACEHOLDER_USER_ID } from '@/lib/auth/placeholder-session';
import DeleteCustomerButton from './delete-customer-button';

export default async function CustomersPage() {
    const customers = await getCustomers(PLACEHOLDER_USER_ID);

    return (
        <div className="max-w-xl space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Customers</h1>
                <Link href="/customers/new" className="text-sm text-teal-700 hover:underline">
                    + New Customer
                </Link>
            </div>

            <ul className="space-y-2">
                {customers.map((customer) => (
                    <li
                        key={customer.id}
                        className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
                    >
                        <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-slate-600">{customer.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/customers/${customer.id}/edit`}
                                className="text-sm text-teal-700 hover:underline"
                            >
                                Edit
                            </Link>
                            <DeleteCustomerButton
                                userId={PLACEHOLDER_USER_ID}
                                customerId={customer.id}
                            />
                        </div>
                    </li>
                ))}
            </ul>

            {customers.length === 0 ? (
                <p className="text-sm text-slate-600">No customers yet.</p>
            ) : null}
        </div>
    );
}
*/