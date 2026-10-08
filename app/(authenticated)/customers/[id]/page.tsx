import CustomerDetails from "./_components/CustomerDetails";
import { PLACEHOLDER_USER_ID } from "@/lib/auth/placeholder-session";
import { getCustomerById } from "@/lib/db/customer/repository";

type CustomerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { id } = await params;
  const customer = await getCustomerById(PLACEHOLDER_USER_ID, id);

  return <CustomerDetails customer={customer} userId={PLACEHOLDER_USER_ID} />;
}
