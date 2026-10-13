"use client";

import { useActionState } from "react";
import { signupAction, type State } from "@/lib/db/users/actions";
import { SignupForm } from "@/components/auth/SignupForm";

const initialState: State = { message: null, errors: {} };

export default function SignupFormWrapper() {
    const [state, formAction, isPending] = useActionState(signupAction, initialState);
    return <SignupForm formAction={formAction} state={state} isPending={isPending} />;
}
