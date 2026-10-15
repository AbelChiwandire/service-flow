import type { Customer } from "@/lib/db/customer/repository";

export default function CustomerDetails({ customer }: { customer: Customer }) {
    return (
        <dl className="details-grid">
            <div className="min-w-0">
                <dt className="label-text">Email</dt>
                <dd className="mt-1 text-foreground">
                    <a href={`mailto:${customer.email}`} className="link-inline">
                        {customer.email}
                    </a>
                </dd>
            </div>

            <div className="min-w-0">
                <dt className="label-text">Phone</dt>
                <dd className="mt-1 text-foreground">
                    <a href={`tel:${customer.phone}`} className="link-inline">
                        {customer.phone}
                    </a>
                </dd>
            </div>

            <div className="min-w-0 sm:col-span-2">
                <dt className="label-text">Address</dt>
                <dd className="mt-1 whitespace-pre-line break-words text-foreground">
                    {customer.address}
                </dd>
            </div>
        </dl>
    );
}
