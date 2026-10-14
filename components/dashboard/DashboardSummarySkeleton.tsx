interface SummaryCardSkeletonProps {
    label: string;
}

function SummaryCardSkeleton({ label }: SummaryCardSkeletonProps) {
    return (
        <div className="block p-4 card-surface">
            <p className="label-text">{label}</p>

            <div aria-hidden="true" className="mt-2 h-9 w-12 skeleton" />
        </div>
    );
}

function JobsPanelSkeleton() {
    return (
        <section className="card-surface">
            <div className="panel-header">
                <div
                    aria-hidden="true"
                    className="h-5 w-32 sm:h-6 skeleton"
                />

                <div aria-hidden="true" className="h-4 w-20 skeleton" />
            </div>

            <ul className="list-divided">
                {[1, 2, 3].map((item) => (
                    <li key={item}>
                        <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-4 sm:px-6">
                            <div className="min-w-0 flex-1 space-y-2">
                                <div
                                    aria-hidden="true"
                                    className="h-4 w-3/4 skeleton"
                                />
                                <div
                                    aria-hidden="true"
                                    className="h-3 w-1/2 skeleton"
                                />
                            </div>

                            <div
                                aria-hidden="true"
                                className="h-3 w-20 shrink-0 sm:h-4 skeleton"
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
                    <h2 className="heading-h2">Jobs</h2>
                    <p className="mt-1 small-text">
                        Overview of your current and upcoming jobs.
                    </p>
                </div>

                <div className="stat-grid">
                    <SummaryCardSkeleton label="Upcoming" />
                    <SummaryCardSkeleton label="Overdue" />
                    <SummaryCardSkeleton label="In progress" />
                    <SummaryCardSkeleton label="Completed" />
                    <SummaryCardSkeleton label="Total jobs" />
                </div>
            </section>

            <section>
                <div className="mb-4">
                    <h2 className="heading-h2">Customers</h2>
                    <p className="mt-1 small-text">Overview of your customer base.</p>
                </div>

                <div className="stat-grid">
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
