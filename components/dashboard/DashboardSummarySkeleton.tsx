interface SummaryCardSkeletonProps {
    label: string;
}

function SummaryCardSkeleton({ label }: SummaryCardSkeletonProps) {
    return (
        <div className="block rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm font-medium text-slate-600">
                {label}
            </p>

            <div
                aria-hidden="true"
                className="mt-2 h-9 w-12 animate-pulse rounded bg-slate-200"
            />
        </div>
    );
}

function JobsPanelSkeleton() {
    return (
        <section className="rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-4 sm:px-5">
                <div
                    aria-hidden="true"
                    className="h-5 w-32 animate-pulse rounded bg-slate-200 sm:h-6"
                />

                <div
                    aria-hidden="true"
                    className="h-4 w-20 animate-pulse rounded bg-slate-200"
                />
            </div>

            <ul className="divide-y divide-slate-100">
                {[1, 2, 3].map((item) => (
                    <li key={item}>
                        <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-5">
                            <div className="min-w-0 flex-1 space-y-2">
                                <div
                                    aria-hidden="true"
                                    className="h-4 w-3/4 animate-pulse rounded bg-slate-200"
                                />
                                <div
                                    aria-hidden="true"
                                    className="h-3 w-1/2 animate-pulse rounded bg-slate-200"
                                />
                            </div>

                            <div
                                aria-hidden="true"
                                className="h-3 w-20 shrink-0 animate-pulse rounded bg-slate-200 sm:h-4"
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default function DashboardSummarySkeleton() {
    return (
        <div className="space-y-8">
            <section>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Jobs
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Overview of your current and upcoming jobs.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
                    <SummaryCardSkeleton label="Upcoming" />
                    <SummaryCardSkeleton label="Overdue" />
                    <SummaryCardSkeleton label="In progress" />
                    <SummaryCardSkeleton label="Completed" />
                    <SummaryCardSkeleton label="Total jobs" />
                </div>
            </section>

            <section>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Customers
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Overview of your customer base.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
                    <SummaryCardSkeleton label="Customers" />
                    <SummaryCardSkeleton label="Leads" />
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
                <JobsPanelSkeleton />
                <JobsPanelSkeleton />
            </div>
        </div>
    );
}