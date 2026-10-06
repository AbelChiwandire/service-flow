import EditCustomerForm from "./_components/EditCustomerForm";

type EditCustomerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCustomerPage({
  params,
}: EditCustomerPageProps) {
  const { id } = await params;

  return <EditCustomerForm customerId={id} />;
}
