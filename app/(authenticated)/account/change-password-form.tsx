'use client';

import { useActionState } from 'react';
import { changePasswordAction, type PasswordChangeState } from '@/lib/db/users/actions';
import { ChangePasswordForm } from '@/components/ChangePasswordForm';

const initialState: PasswordChangeState = { message: null, errors: {} };

export default function ChangePasswordFormWrapper({ userId }: { userId: string }) {
    const boundChangePasswordAction = changePasswordAction.bind(null, userId);
    const [state, formAction, isPending] = useActionState(boundChangePasswordAction, initialState);

    return <ChangePasswordForm formAction={formAction} state={state} isPending={isPending} />;
}