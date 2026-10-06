import EditCustomerForm from "./_components/EditCustomerForm";
import { PLACEHOLDER_USER_ID } from "@/lib/auth/placeholder-session";
import { getCustomerById } from "@/lib/db/customer/repository";

type EditCustomerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCustomerPage({
  params,
}: EditCustomerPageProps) {
  const { id } = await params;
  const customer = await getCustomerById(PLACEHOLDER_USER_ID, id);

  const initialValues = customer
    ? {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      }
    : null;

  return (
    <EditCustomerForm
      customerId={id}
      userId={PLACEHOLDER_USER_ID}
      initialValues={initialValues}
    />
  );
}