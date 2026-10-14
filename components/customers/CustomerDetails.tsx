import type { Customer } from "@/lib/db/customer/repository";

const termClassName = "text-sm font-medium text-slate-500";
const linkClassName = "break-words transition-colors hover:text-[#2667FF] hover:underline";

export default function CustomerDetails({ customer }: { customer: Customer }) {
  return (
    <dl className="grid gap-6 rounded-lg border border-slate-200 bg-white p-6 sm:grid-cols-2">
      <div className="min-w-0">
        <dt className={termClassName}>Email</dt>
        <dd className="mt-1 text-slate-900">
          <a href={`mailto:${customer.email}`} className={linkClassName}>
            {customer.email}
          </a>
        </dd>
      </div>

      <div className="min-w-0">
        <dt className={termClassName}>Phone</dt>
        <dd className="mt-1 text-slate-900">
          <a href={`tel:${customer.phone}`} className={linkClassName}>
            {customer.phone}
          </a>
        </dd>
      </div>

      <div className="min-w-0 sm:col-span-2">
        <dt className={termClassName}>Address</dt>
        <dd className="mt-1 whitespace-pre-line break-words text-slate-900">
          {customer.address}
        </dd>
      </div>
    </dl>
  );
}