"use client";

import type { State } from "@/lib/db/customer/actions";
import { FieldErrors, FormActions } from "@/components/shared/form";
import { useFormFeedback } from "@/components/shared/useFormFeedback";

const FIELDS = ["name", "email", "phone", "address"] as const;
type FieldName = (typeof FIELDS)[number];

type CustomerValues = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
};

type CustomerFormProps = {
  formAction: (formData: FormData) => void;
  state: State;
  isPending: boolean;
  initialValues?: CustomerValues;
  cancelHref: string;
  cancelLabel: string;
  isEditing?: boolean;
};

export function CustomerForm({
  formAction,
  state,
  isPending,
  initialValues,
  cancelHref,
  cancelLabel,
  isEditing = false,
}: CustomerFormProps) {
  const { getFieldErrors, clearFieldError, resetFeedback, isMessageDismissed } =
    useFormFeedback(state, FIELDS);
  const values = {
    name: state.values?.name ?? initialValues?.name ?? "",
    email: state.values?.email ?? initialValues?.email ?? "",
    phone: state.values?.phone ?? initialValues?.phone ?? "",
    address: state.values?.address ?? initialValues?.address ?? "",
  };
  const inputClassName = (field: FieldName) =>
    `input-field ${getFieldErrors(field)?.length ? "input-field-invalid" : ""}`;

  return (
    <form
      action={formAction}
      aria-busy={isPending}
      onSubmit={resetFeedback}
      className="space-y-6"
    >
      <div>
        <label htmlFor="name" className="mb-1 field-label">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          defaultValue={values.name}
          onChange={() => clearFieldError("name")}
          aria-invalid={Boolean(getFieldErrors("name")?.length)}
          aria-describedby="name-error"
          className={inputClassName("name")}
        />
        <FieldErrors id="name" errors={getFieldErrors("name")} />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 field-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={values.email}
          onChange={() => clearFieldError("email")}
          aria-invalid={Boolean(getFieldErrors("email")?.length)}
          aria-describedby="email-error"
          className={inputClassName("email")}
        />
        <FieldErrors id="email" errors={getFieldErrors("email")} />
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 field-label">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          defaultValue={values.phone}
          onChange={() => clearFieldError("phone")}
          aria-invalid={Boolean(getFieldErrors("phone")?.length)}
          aria-describedby="phone-error"
          className={inputClassName("phone")}
        />
        <FieldErrors id="phone" errors={getFieldErrors("phone")} />
      </div>

      <div>
        <label htmlFor="address" className="mb-1 field-label">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          autoComplete="street-address"
          required
          rows={3}
          defaultValue={values.address}
          onChange={() => clearFieldError("address")}
          aria-invalid={Boolean(getFieldErrors("address")?.length)}
          aria-describedby="address-error"
          className={inputClassName("address")}
        />
        <FieldErrors id="address" errors={getFieldErrors("address")} />
      </div>

      {state.message && !isMessageDismissed ? (
        <div role="alert" className="error-text">
          <p className="font-semibold">
            {isEditing ? "Changes could not be saved." : "Customer could not be created."}
          </p>
          <p className="mt-1">{state.message}</p>
        </div>
      ) : null}

      <FormActions
        cancelHref={cancelHref}
        cancelLabel={cancelLabel}
        submitLabel={isEditing ? "Save changes" : "Save customer"}
        pendingLabel={isEditing ? "Saving changes…" : "Saving customer…"}
        isPending={isPending}
      />
    </form>
  );
}