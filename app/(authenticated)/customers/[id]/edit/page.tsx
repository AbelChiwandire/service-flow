import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCustomerById } from "@/lib/db/customer/repository";
import { IdSchema } from "@/lib/db/customer/schema";
import { requireUserId } from "@/lib/auth/session";
import { PageHeader } from "@/components/shared/PageHeader";
import { UpdateCustomerForm } from "@/components/customers/UpdateCustomerForm";

export const metadata: Metadata = {
    title: "Edit customer",
    description: "Update this customer's contact information.",
};

export const dynamic = "force-dynamic";

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (!IdSchema.safeParse(id).success) {
        notFound();
    }

    const userId = await requireUserId();
    const customer = await getCustomerById(userId, id);

    if (!customer) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Edit customer"
                description="Update this customer's contact information."
                back={{ href: `/customers/${customer.id}`, label: "Back to customer" }}
            />

            <div className="max-w-xl">
                <UpdateCustomerForm
                    customerId={customer.id}
                    initialValues={{
                        name: customer.name,
                        email: customer.email,
                        phone: customer.phone,
                        address: customer.address,
                    }}
                />
            </div>
        </div>
    );
}