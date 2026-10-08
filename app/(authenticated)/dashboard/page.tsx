import DashboardSummary from '@/components/dashboard/DashboardSummary';
import { requireUserId } from '@/lib/auth/session';
import { PageHeader } from '@/components/shared/PageHeader';
import { Suspense } from 'react';
import DashboardSummarySkeleton from '@/components/dashboard/DashboardSummarySkeleton';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const userId = await requireUserId();
    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-6 pt-0 sm:px-6 sm:py-8 sm:pt-0">
            <PageHeader
                title="Dashboard"
                description="Overview of your service business."
            />

            <Suspense fallback={<DashboardSummarySkeleton />}>
                <DashboardSummary userId={userId} />
            </Suspense>
        </main>
    );
}