'use client';

import { useActionState } from 'react';
import { createCustomerAction, type State } from '@/lib/db/customer/actions';
import { CustomerForm } from '@/components/customers/CustomerForm';

const initialState: State = { message: null, errors: {} };

export default function CreateCustomerForm({}: object) {
    const [state, formAction, isPending] = useActionState(createCustomerAction, initialState);
    
    return (
        <CustomerForm
            formAction={formAction}
            state={state}
            isPending={isPending}
            cancelHref="/customers"
            cancelLabel="Cancel"
        />
    );
}

