import { countJobs, getJobs, type JobWithCustomer } from '../jobs/repository';
import { countCustomers } from '../customer/repository';

// How many rows the upcoming and overdue previews show.
const PREVIEW_SIZE = 5;

// The only job fields the dashboard displays.
export type DashboardJob = Pick<
    JobWithCustomer,
    'id' | 'title' | 'scheduledDate' | 'customerName'
>;

export interface DashboardCounts {
    upcoming: number;
    overdue: number;
    inProgress: number;
    completed: number;
    jobs: number;
    customers: number;
    leads: number;
}

export interface DashboardData {
    counts: DashboardCounts;
    upcomingJobs: DashboardJob[];
    overdueJobs: DashboardJob[];
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
    const [
        upcoming,
        overdue,
        inProgress,
        completed,
        jobs,
        customers,
        leads,
        upcomingJobs,
        overdueJobs,
    ] = await Promise.all([
        countJobs(userId, { due: 'upcoming' }),
        countJobs(userId, { due: 'overdue' }),
        countJobs(userId, { status: 'in_progress' }),
        countJobs(userId, { status: 'completed' }),
        countJobs(userId),
        countCustomers(userId),
        countCustomers(userId, { filter: 'leads' }),
        getJobs(userId, { due: 'upcoming', pageSize: PREVIEW_SIZE }),
        getJobs(userId, { due: 'overdue', pageSize: PREVIEW_SIZE }),
    ]);

    return {
        counts: { upcoming, overdue, inProgress, completed, jobs, customers, leads },
        upcomingJobs,
        overdueJobs,
    };
}