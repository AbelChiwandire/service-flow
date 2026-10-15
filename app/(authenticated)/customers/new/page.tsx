import type { Metadata } from "next";
import { CreateCustomerForm } from "@/components/customers/CreateCustomerForm";
import { requireUserId } from "@/lib/auth/session";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = {
    title: "Add customer",
    description: "Add a customer to your customer list.",
};

export const dynamic = "force-dynamic";

export default async function NewCustomerPage() {
    await requireUserId();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Add a customer"
                description="Enter your customer's contact information to add them to your customer list."
                back={{ href: "/customers", label: "Back to customers" }}
            />

            <div className="max-w-xl">
                <CreateCustomerForm />
            </div>
        </div>
    );
}
