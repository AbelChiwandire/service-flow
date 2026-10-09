"use client";

import { useState } from "react";
import { Modal } from "./Modal";

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

  const triggerClassName = destructive
    ? "border-red-300 text-red-700 hover:bg-red-50"
    : "border-slate-300 text-slate-700 hover:bg-slate-50";

  const confirmClassName = destructive
    ? "bg-red-600 hover:bg-red-700"
    : "bg-[#2667FF] hover:bg-[#3F8EFC]";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex h-10 items-center justify-center rounded-md border bg-white px-4 text-sm font-medium transition-colors ${triggerClassName}`}
      >
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
            <p role="alert" className="text-sm text-red-600">
              {message}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400"
            >
              Go back
            </button>

            <button
              type="submit"
              disabled={isPending}
              className={`inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${confirmClassName}`}
            >
              {isPending ? pendingLabel : confirmLabel}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
