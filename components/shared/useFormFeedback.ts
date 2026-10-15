"use client";

import { useEffect, useState } from "react";

type FieldErrors<F extends string> = Partial<Record<F, string[] | undefined>>;

// Shared form behaviour: a field's error clears once it is edited, the form message is
// dismissed on edit, and the first invalid field is focused after a failed submit.
export function useFormFeedback<F extends string>(
    state: { errors?: FieldErrors<F> },
    fields: readonly F[],
) {
    const [clearedErrors, setClearedErrors] = useState<Set<F>>(() => new Set());
    const [isMessageDismissed, setIsMessageDismissed] = useState(false);

    const getFieldErrors = (field: F) =>
        clearedErrors.has(field) ? undefined : state.errors?.[field];

    const clearFieldError = (field: F) => {
        setClearedErrors((current) => new Set(current).add(field));
        setIsMessageDismissed(true);
    };

    const resetFeedback = () => {
        setClearedErrors(new Set());
        setIsMessageDismissed(false);
    };

    useEffect(() => {
        const firstInvalidField = fields.find((field) => state.errors?.[field]?.length);
        if (firstInvalidField) {
            document.getElementById(firstInvalidField)?.focus();
        }
        // `fields` is a constant list owned by the caller.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    return { getFieldErrors, clearFieldError, resetFeedback, isMessageDismissed };
}
