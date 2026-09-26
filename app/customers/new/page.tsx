import CreateCustomerForm from './create-customer-form';
import { PLACEHOLDER_USER_ID } from '@/lib/auth/placeholder-session';

export default function NewCustomerPage() {
    return <CreateCustomerForm userId={PLACEHOLDER_USER_ID} />;
}