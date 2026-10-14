import type { Metadata } from "next";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import { requireUserId } from "@/lib/auth/session";
import { PageHeader } from "@/components/shared/PageHeader";
import { Suspense } from "react";

import DashboardSummarySkeleton from "@/components/dashboard/DashboardSummarySkeleton";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Overview of your service business.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const userId = await requireUserId();
    return (
        <div>
            <PageHeader title="Dashboard" description="Overview of your service business." />

            <Suspense fallback={<DashboardSummarySkeleton />}>
                <DashboardSummary userId={userId} />
            </Suspense>
        </div>
    );
}
