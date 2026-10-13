import Link from "next/link";
import type { Customer } from "@/lib/db/customer/repository";
import { DataRow } from "@/components/shared/DataTable";

const contactLinkClassName =
  "break-words text-slate-600 transition-colors hover:text-[#2667FF] hover:underline";

export default function CustomerItem({ customer }: { customer: Customer }) {
  return (
    <DataRow>
      <div className="min-w-0 md:col-span-3">
        <Link
          href={`/customers/${encodeURIComponent(customer.id)}`}
          className="font-medium text-slate-900 transition-colors hover:text-[#2667FF]"
        >
          {customer.name}
        </Link>
      </div>

      <p className="min-w-0 text-sm md:col-span-3">
        <span className="text-slate-500 md:hidden">Email: </span>
        <a href={`mailto:${customer.email}`} className={contactLinkClassName}>
          {customer.email}
        </a>
      </p>

      <p className="min-w-0 text-sm md:col-span-2">
        <span className="text-slate-500 md:hidden">Phone: </span>
        <a href={`tel:${customer.phone}`} className={contactLinkClassName}>
          {customer.phone}
        </a>
      </p>

      <p className="min-w-0 break-words text-sm text-slate-600 md:col-span-4">
        <span className="text-slate-500 md:hidden">Address: </span>
        {customer.address}
      </p>
    </DataRow>
  );
}