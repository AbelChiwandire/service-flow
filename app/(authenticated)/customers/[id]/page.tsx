import CustomerDetails from "./_components/CustomerDetails";
import { getCustomerById } from "@/lib/db/customer/repository";
import { requireUserId } from "@/lib/auth/session";

type CustomerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { id } = await params;
  const userId = await requireUserId();
  const customer = await getCustomerById(userId, id);

  return <CustomerDetails customer={customer} userId={userId} />;
}
