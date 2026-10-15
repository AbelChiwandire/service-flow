"use client";

import { useActionState } from "react";
import { changePasswordAction, type PasswordChangeState } from "@/lib/db/users/actions";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";

const initialState: PasswordChangeState = { message: null, errors: {} };

export default function ChangePasswordFormWrapper({}: object) {
    const boundChangePasswordAction = changePasswordAction;
    const [state, formAction, isPending] = useActionState(boundChangePasswordAction, initialState);

    return <ChangePasswordForm formAction={formAction} state={state} isPending={isPending} />;
}
