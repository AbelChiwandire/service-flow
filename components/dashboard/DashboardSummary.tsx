import { getDashboardData } from '@/lib/db/dashboard/repository';
import SummaryCard from './SummaryCard';
import UpcomingJobs from './UpcomingJobs';
import OverdueJobs from './OverdueJobs';

export default async function DashboardSummary({ userId }: { userId: string }) {
    const { counts, upcomingJobs, overdueJobs } = await getDashboardData(userId);

    return (
        <div className="space-y-8">
            <section>
                <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
                    Jobs
                </h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
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
                    <SummaryCard label="Total jobs" value={counts.jobs} href="/jobs" />
                </div>
            </section>

            <section>
                <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
                    Customers
                </h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    <SummaryCard
                        label="Customers"
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
                <OverdueJobs jobs={overdueJobs} total={counts.overdue} />
                <UpcomingJobs jobs={upcomingJobs} total={counts.upcoming} />
            </div>
        </div>
    );
}