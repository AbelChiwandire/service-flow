"use client";

import { useActionState } from "react";
import { deleteUserAction, type State } from "@/lib/db/users/actions";
import { ConfirmActionButton } from "@/components/shared/ConfirmActionButton";

const initialState: State = { message: null, errors: {} };

export function DeleteAccountButton({ email }: { email: string }) {
    const [state, formAction, isPending] = useActionState(deleteUserAction, initialState);

    return (
        <ConfirmActionButton
            triggerLabel="Delete account"
            title="Delete your account?"
            description={`This deletes the account for ${email} and every customer and job you own. This can't be undone.`}
            confirmLabel="Delete account"
            pendingLabel="Deleting..."
            destructive
            formAction={formAction}
            isPending={isPending}
            message={state.message}
        />
    );
}
