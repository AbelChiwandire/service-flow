import { notFound } from "next/navigation";
import { getCustomerById } from "@/lib/db/customer/repository";
import EditCustomerForm from "../../../../../components/customers/EditCustomerForm";
import { requireUserId } from "@/lib/auth/session";

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
    const userId = await requireUserId();
    const { id } = await params;
    const customer = await getCustomerById(userId, id);

    if (!customer) {
        notFound();
    }

    const initialValues = {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      };

  return (
    <EditCustomerForm
      customerId={customer.id}
      initialValues={initialValues}
    />
  );
}
