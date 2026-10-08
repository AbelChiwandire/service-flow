import { notFound } from 'next/navigation';
import { getCustomerById } from '@/lib/db/customer/repository';
import UpdateCustomerForm from './update-customer-form';
import { PLACEHOLDER_USER_ID } from '@/lib/auth/placeholder-session';

export default async function EditCustomerPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const customer = await getCustomerById(PLACEHOLDER_USER_ID, id);

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
        <UpdateCustomerForm
            userId={PLACEHOLDER_USER_ID}
            customerId={customer.id}
            initialValues={initialValues}
        />
    );
}