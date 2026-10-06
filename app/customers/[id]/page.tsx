import CustomerDetails from "./_components/CustomerDetails";

type CustomerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { id } = await params;

  return <CustomerDetails customerId={id} />;
}
