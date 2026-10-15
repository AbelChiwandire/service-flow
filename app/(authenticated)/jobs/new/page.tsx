import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { getCustomers } from "@/lib/db/customer/repository";
import { requireUserId } from "@/lib/auth/session";
import { CreateJobForm } from "@/components/jobs/CreateJobForm";

export const metadata: Metadata = {
  title: "New job",
  description: "Schedule a new job for one of your customers.",
};

export const dynamic = "force-dynamic";

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { customerId } = await searchParams;
  const requestedCustomerId = Array.isArray(customerId) ? customerId[0] : customerId;

  const userId = await requireUserId();
  // The picker needs every customer, not one page, so ask for a large page.
  const customers = (await getCustomers(userId, { pageSize: 1000 })).map(
    ({ id, name }) => ({ id, name }),
  );

  // Only preselect a customer that actually exists (e.g. from /jobs/new?customerId=...).
  const defaultCustomerId = customers.some((c) => c.id === requestedCustomerId)
    ? requestedCustomerId
    : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title="New job"
        description="Schedule work for one of your customers."
        back={{ href: "/jobs", label: "Back to jobs" }}
      />

      {customers.length === 0 ? (
        <EmptyState
          title="Add a customer first"
          message="Every job belongs to a customer. Add one, then come back to schedule the job."
          action={<ButtonLink href="/customers/new">Add a customer</ButtonLink>}
        />
      ) : (
        <div className="max-w-xl">
          <CreateJobForm
            customers={customers}
            defaultCustomerId={defaultCustomerId}
          />
        </div>
      )}
    </div>
  );
}
