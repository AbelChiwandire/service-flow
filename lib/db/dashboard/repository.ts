import { countJobs, getJobs, JobWithCustomer } from './temp-jobs';
import { countCustomers } from './temp-customers';

// How many rows the upcoming and overdue previews show.
const PREVIEW_SIZE = 5;

export interface DashboardData {
    counts: {
        upcoming: number;
        overdue: number;
        inProgress: number;
        completed: number;
        customers: number;
        leads: number;
    };
    upcomingJobs: JobWithCustomer[];
    overdueJobs: JobWithCustomer[];
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
    const [
        upcoming,
        overdue,
        inProgress,
        completed,
        customers,
        leads,
        upcomingJobs,
        overdueJobs,
    ] = await Promise.all([
        countJobs(userId, { due: 'upcoming' }),
        countJobs(userId, { due: 'overdue' }),
        countJobs(userId, { status: 'in_progress' }),
        countJobs(userId, { status: 'completed' }),
        countCustomers(userId),
        countCustomers(userId, { filter: 'leads' }),
        getJobs(userId, { due: 'upcoming', pageSize: PREVIEW_SIZE }),
        getJobs(userId, { due: 'overdue', pageSize: PREVIEW_SIZE }),
    ]);

    return {
        counts: { upcoming, overdue, inProgress, completed, customers, leads },
        upcomingJobs,
        overdueJobs,
    };
}