'use client';

import { useActionState } from 'react';
import { updateUserProfileAction, type State } from '@/lib/db/users/actions';
import { UserProfileForm } from '@/components/profile/UserProfileForm';

const initialState: State = { message: null, errors: {} };

type UpdateProfileFormProps = {
    initialValues: {
        name: string;
        businessName: string;
        email: string;
    };
};

export default function UpdateProfileForm({ initialValues }: UpdateProfileFormProps) {
    const boundUpdateUserProfileAction = updateUserProfileAction;
    const [state, formAction, isPending] = useActionState(
        boundUpdateUserProfileAction,
        initialState
    );

    return (
        <UserProfileForm
            formAction={formAction}
            state={state}
            isPending={isPending}
            initialValues={initialValues}
        />
    );
}