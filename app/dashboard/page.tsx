import DashboardSummary from '@/components/dashboard/DashboardSummary';
import { PLACEHOLDER_USER_ID } from '@/lib/auth/placeholder-session';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
    return (
        <main className="mx-auto max-w-6xl p-6">
            <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>
            <DashboardSummary userId={PLACEHOLDER_USER_ID} />
        </main>
    );
}