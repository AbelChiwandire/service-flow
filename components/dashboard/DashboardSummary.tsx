import { getDashboardData } from '@/lib/db/dashboard/repository';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { EmptyState } from '@/components/shared/EmptyState';
import SummaryCard from './SummaryCard';
import UpcomingJobs from './UpcomingJobs';
import OverdueJobs from './OverdueJobs';
import Link from 'next/link';

export default async function DashboardSummary({ userId }: { userId: string }) {
    let data: Awaited<ReturnType<typeof getDashboardData>>;

    try {
        data = await getDashboardData(userId);
    } catch (error) {
        console.error('Failed to load dashboard data', error);
        return (
            <ErrorMessage
                title="Could not load the dashboard"
                message="We could not load your dashboard data. Please refresh the page to try again."
            />
        );
    }

    const { counts, upcomingJobs, overdueJobs } = data;

    if (counts.customers === 0) {
        return (
            <EmptyState
                title="Get started with ServiceFlow"
                message="Add your first customer to start managing your customers and service jobs."
                action={
                    <Link
                        href="/customers/new"
                        className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                        Add your first customer
                    </Link>
                }
            />
        );
    }

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
                    <SummaryCard
                        label="Upcoming"
                        value={counts.upcoming}
                        href="/jobs?due=upcoming"
                    />
                    <SummaryCard
                        label="Overdue"
                        value={counts.overdue}
                        href="/jobs?due=overdue"
                        tone="alert"
                    />
                    <SummaryCard
                        label="In progress"
                        value={counts.inProgress}
                        href="/jobs?status=in_progress"
                    />
                    <SummaryCard
                        label="Completed"
                        value={counts.completed}
                        href="/jobs?status=completed"
                    />
                    <SummaryCard
                        label="Total jobs"
                        value={counts.jobs}
                        href="/jobs"
                    />
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
                    <SummaryCard
                        label="Total Customers"
                        value={counts.customers}
                        href="/customers"
                    />
                    <SummaryCard
                        label="Leads"
                        value={counts.leads}
                        href="/customers?filter=leads"
                    />
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
                <OverdueJobs
                    jobs={overdueJobs}
                    total={counts.overdue}
                />
                <UpcomingJobs
                    jobs={upcomingJobs}
                    total={counts.upcoming}
                />
            </div>
        </div>
    );
}