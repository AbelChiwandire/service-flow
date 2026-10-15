"use client";

import { useState } from "react";
import { Modal } from "@/components/layout/Modal";

type ConfirmActionButtonProps = {
    triggerLabel: string;
    title: string;
    description: string;
    confirmLabel: string;
    pendingLabel: string;
    formAction: (formData: FormData) => void;
    isPending: boolean;
    message?: string | null;
    destructive?: boolean;
};

export function ConfirmActionButton({
    triggerLabel,
    title,
    description,
    confirmLabel,
    pendingLabel,
    formAction,
    isPending,
    message,
    destructive = false,
}: ConfirmActionButtonProps) {
    const [open, setOpen] = useState(false);

    const triggerClassName = destructive ? "btn-danger-outline" : "btn-secondary";

    const confirmClassName = destructive ? "btn-danger" : "btn-primary";

    return (
        <>
            <button type="button" onClick={() => setOpen(true)} className={triggerClassName}>
                {triggerLabel}
            </button>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title={title}
                description={description}
            >
                <form action={formAction} className="space-y-4">
                    {message ? (
                        <p role="alert" className="error-text">
                            {message}
                        </p>
                    ) : null}

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="btn-secondary"
                        >
                            Go back
                        </button>

                        <button type="submit" disabled={isPending} className={confirmClassName}>
                            {isPending ? pendingLabel : confirmLabel}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
