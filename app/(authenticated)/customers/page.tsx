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