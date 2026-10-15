"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
};

// Built on the native <dialog> element, which handles focus trapping,
// the Escape key and the backdrop.
export function Modal({ open, onClose, title, description, children }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            onClick={(event) => {
                // A click on the backdrop targets the dialog element itself.
                if (event.target === dialogRef.current) onClose();
            }}
            aria-labelledby={titleId}
            className="m-auto w-[calc(100%-2rem)] max-w-md p-0 text-foreground shadow-xl backdrop:bg-black/40 card-surface"
        >
            <div className="space-y-4 p-6">
                <div>
                    <h2 id={titleId} className="heading-h2">
                        {title}
                    </h2>

                    {description ? <p className="mt-2 body-text">{description}</p> : null}
                </div>

                {children}
            </div>
        </dialog>
    );
}
