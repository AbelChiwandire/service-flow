import CreateCustomerForm from '../create-customer-form';

export default function CustomerForm({ userId }: { userId: string }) {
    return <CreateCustomerForm userId={userId} />;
}
