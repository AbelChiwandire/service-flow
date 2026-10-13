import Link from "next/link";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

type CustomerItemProps = {
  customer: Customer;
};

export default function CustomerItem({ customer }: CustomerItemProps) {
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-slate-950">
            <Link
              href={`/customers/${encodeURIComponent(customer.id)}`}
              className="rounded-sm decoration-[#2667FF] underline-offset-4 hover:text-[#2667FF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF]"
            >
              {customer.name}
              <span className="sr-only"> — view customer</span>
            </Link>
          </h2>
          <p className="mt-1 break-words text-sm text-slate-600">
            {customer.address}
          </p>
        </div>
        <span className="w-fit shrink-0 rounded-full bg-[#2667FF]/10 px-3 py-1 text-xs font-semibold text-[#3B28CC]">
          Customer
        </span>
      </div>

      <dl className="mt-5 grid gap-4 border-t border-slate-100 pt-4 text-sm sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Email
          </dt>
          <dd className="mt-1 break-words">
            <a
              href={`mailto:${customer.email}`}
              className="rounded-sm text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-[#2667FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF]"
            >
              {customer.email}
            </a>
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Phone
          </dt>
          <dd className="mt-1 break-words">
            <a
              href={`tel:${customer.phone}`}
              className="rounded-sm text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-[#2667FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF]"
            >
              {customer.phone}
            </a>
          </dd>
        </div>
      </dl>
    </li>
  );
}
