"use client";

import { useActionState } from "react";
import { deleteCustomerAction, type State } from "@/lib/db/customer/actions";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";

const initialState: State = { message: null, errors: {} };

export function DeleteCustomerButton({
    customerId,
    customerName,
}: {
    customerId: string;
    customerName: string;
}) {
    const [state, formAction, isPending] = useActionState(
        deleteCustomerAction.bind(null, customerId),
        initialState,
    );

    return (
        <ConfirmActionButton
            triggerLabel="Delete customer"
            title="Delete this customer?"
            description={`This removes ${customerName} from your customers. A customer with scheduled or in-progress jobs can't be deleted. This can't be undone.`}
            confirmLabel="Delete customer"
            pendingLabel="Deleting..."
            destructive
            formAction={formAction}
            isPending={isPending}
            message={state.message}
        />
    );
}
