import Link from "next/link";
import type { Customer } from "@/lib/db/customer/repository";
import { DataRow } from "@/components/shared/DataTable";

export default function CustomerItem({ customer }: { customer: Customer }) {
    return (
        <DataRow>
            <div className="min-w-0 md:col-span-3">
                <Link
                    href={`/customers/${encodeURIComponent(customer.id)}`}
                    className="link-subtle"
                >
                    {customer.name}
                </Link>
            </div>

            <p className="min-w-0 small-text md:col-span-3">
                <span className="text-foreground md:hidden">Email: </span>
                <a href={`mailto:${customer.email}`} className="link-inline">
                    {customer.email}
                </a>
            </p>

            <p className="min-w-0 small-text md:col-span-2">
                <span className="text-foreground md:hidden">Phone: </span>
                <a href={`tel:${customer.phone}`} className="link-inline">
                    {customer.phone}
                </a>
            </p>

            <p className="min-w-0 break-words md:col-span-4 small-text">
                <span className="text-foreground md:hidden">Address: </span>
                {customer.address}
            </p>
        </DataRow>
    );
}
