"use client";

import { useActionState } from "react";
import { updateCustomerAction, type State } from "@/lib/db/customer/actions";
import { CustomerForm } from "@/components/customers/CustomerForm";

const initialState: State = { message: null, errors: {} };

type UpdateCustomerFormProps = {
    customerId: string;
    initialValues: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
};

export default function UpdateCustomerForm({ customerId, initialValues }: UpdateCustomerFormProps) {
    const boundUpdateCustomerAction = updateCustomerAction.bind(null, customerId);
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
