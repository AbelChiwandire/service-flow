import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";

const features = [
  {
    title: "Manage customers",
    description:
      "Keep customer information organized and accessible from one workspace.",
  },
  {
    title: "Track jobs",
    description:
      "Create jobs, schedule work, and keep track of progress from start to completion.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-slate-50">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-32">
            <div>
              <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-[#2667FF]">
                Simple business management
              </span>

              <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Run your service business with{" "}
                <span className="text-[#2667FF]">less complexity.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                ServiceFlow helps small service businesses manage customers and jobs efficiently.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-[#2667FF] px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3F8EFC]"
                >
                  Get started
                </Link>

                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition-colors hover:border-[#2667FF] hover:text-[#2667FF]"
                >
                  Sign in
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      Business overview
                    </h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Total Customers</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      24
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Total jobs</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      12
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Kitchen maintenance
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Scheduled for tomorrow
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-[#2667FF]">
                      Scheduled
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Office cleaning
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Ready for completion
                      </p>
                    </div>

                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-[#3B28CC]">
                      In progress
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#2667FF]">
                Everything you need
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Keep your day-to-day work organized.
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600">
                ServiceFlow focuses on the workflows small service businesses
                use most, without adding unnecessary complexity.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 font-bold text-[#2667FF]">
                    ✓
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#2667FF]">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Spend less time organizing and more time serving customers.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-blue-100">
              Start building a clearer workflow for your service business with
              ServiceFlow.
            </p>

            <Link
              href="/signup"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-white px-6 text-sm font-semibold text-[#2667FF] transition-colors hover:bg-blue-50"
            >
              Create your account
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© 2026 ServiceFlow. All rights reserved.</p>

          <p>Simple tools for small service businesses.</p>
        </div>
      </footer>
    </div>
  );
}