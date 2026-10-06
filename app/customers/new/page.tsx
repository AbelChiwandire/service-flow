import Link from "next/link";
import CustomerForm from "./_components/CustomerForm";

export default function NewCustomerPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/customers"
          className="inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-[#2667FF] underline-offset-4 hover:text-[#3F8EFC] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF] focus-visible:ring-offset-2"
        >
          <span aria-hidden="true" className="mr-2">
            ←
          </span>
          Back to customers
        </Link>

        <header className="mb-8 mt-6">
          <p className="text-sm font-semibold tracking-wide text-[#3B28CC]">
            ServiceFlow
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Add a customer
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Enter your customer&apos;s contact information to add them to your
            customer list.
          </p>
        </header>

        <CustomerForm />
      </div>
    </main>
  );
}
