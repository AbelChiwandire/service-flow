'use client';

import { useActionState } from 'react';
import { createCustomerAction, type State } from '@/lib/db/customer/actions';
import { CustomerForm } from '@/components/CustomerForm';

const initialState: State = { message: null, errors: {} };

export default function CreateCustomerForm(
    { userId }: { userId: string }
) {
    const boundCreateCustomerAction = createCustomerAction.bind(null, userId);
    const [state, formAction, isPending] = useActionState(boundCreateCustomerAction, initialState);
    
    return <CustomerForm formAction={formAction} state={state} isPending={isPending} />;
}