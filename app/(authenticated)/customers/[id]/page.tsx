import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCustomerById } from "@/lib/db/customer/repository";
import { IdSchema } from "@/lib/db/customer/schema";
import { requireUserId } from "@/lib/auth/session";
import CustomerDetails from "@/components/customers/CustomerDetails";
import CustomerJobList from "@/components/customers/CustomerJobList";
import { DeleteCustomerButton } from "@/components/customers/DeleteCustomerButton";
import { PageHeader } from "@/components/shared/PageHeader";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { DeleteSection } from "@/components/shared/DeleteSection";

export const dynamic = "force-dynamic";

// Shared by generateMetadata and the page so the customer is only loaded once per request.
const loadCustomer = cache(async (id: string) => {
  if (!IdSchema.safeParse(id).success) return null;
  const userId = await requireUserId();
  return getCustomerById(userId, id);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const customer = await loadCustomer(id);

  return { title: customer ? customer.name : "Customer not found" };
}

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await loadCustomer(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={customer.name}
        description="Customer details and service history."
        back={{ href: "/customers", label: "Back to customers" }}
        action={
          <ButtonLink href={`/customers/${customer.id}/edit`} variant="secondary">
            Edit customer
          </ButtonLink>
        }
      />

      <CustomerDetails customer={customer} />

      <CustomerJobList customer={customer} />

      <DeleteSection>
        <DeleteCustomerButton customerId={customer.id} customerName={customer.name} />
      </DeleteSection>
    </div>
  );
}