'use client';

import { useActionState } from 'react';
import { updateCustomerAction, type State } from '@/lib/db/customer/actions';
import { CustomerForm } from '@/components/CustomerForm';

const initialState: State = { message: null, errors: {} };

type UpdateCustomerFormProps = {
    userId: string;
    customerId: string;
    initialValues: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
};

export default function UpdateCustomerForm({
    userId,
    customerId,
    initialValues,
}: UpdateCustomerFormProps) {
    const boundUpdateCustomerAction = updateCustomerAction.bind(null, userId, customerId);
    const [state, formAction, isPending] = useActionState(boundUpdateCustomerAction, initialState);

    return (
        <CustomerForm
            formAction={formAction}
            state={state}
            isPending={isPending}
            initialValues={initialValues}
        />
    );
}