'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
    createCustomer,
    updateCustomer,
    deleteCustomer,
    CustomerHasActiveJobsError,
} from './repository';
import {
    CustomerFormSchema,
    IdSchema,
    formatValidationErrors,
    type CustomerFormErrors,
} from './schema';

export type State = {
    errors?: CustomerFormErrors;
    message?: string | null;
    values?: {
        name?: string;
        email?: string;
        phone?: string;
        address?: string;
    };
};

function validateCustomerForm(formData: FormData) {
    return CustomerFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
    });
}

function getRawCustomerValues(formData: FormData): State['values'] {
    return {
        name: formData.get('name')?.toString(),
        email: formData.get('email')?.toString(),
        phone: formData.get('phone')?.toString(),
        address: formData.get('address')?.toString(),
    };
}

async function runMutation(
    mutation: () => Promise<unknown>,
    logLabel: string
): Promise<State | undefined> {
    try {
        await mutation();
    } catch (error) {
        if (error instanceof CustomerHasActiveJobsError) {
            return { message: error.message };
        }
        console.error(logLabel, error);
        throw error;
    }

    revalidatePath('/customers');
    redirect('/customers');
}

export async function createCustomerAction(
    userId: string,
    _prevState: State,
    formData: FormData
): Promise<State> {
    const validatedData = validateCustomerForm(formData);
    if (!validatedData.success) {
        return {
            errors: formatValidationErrors(validatedData.error),
            message: 'Missing or invalid fields. Failed to create Customer.',
            values: getRawCustomerValues(formData),
        };
    }

    const result = await runMutation(
        () => createCustomer({ userId, ...validatedData.data }),
        'createCustomerAction failed:'
    );
    return result ?? {};
}

export async function updateCustomerAction(
    userId: string,
    id: string,
    _prevState: State,
    formData: FormData
): Promise<State> {
    if (!IdSchema.safeParse(id).success) {
        return { message: 'Invalid customer id.' };
    }

    const validatedData = validateCustomerForm(formData);
    if (!validatedData.success) {
        return {
            errors: formatValidationErrors(validatedData.error),
            message: 'Missing or invalid fields. Failed to update Customer.',
            values: getRawCustomerValues(formData),
        };
    }

    const result = await runMutation(
        () => updateCustomer(userId, id, validatedData.data),
        'updateCustomerAction failed:'
    );
    return result ?? {};
}

export async function deleteCustomerAction(
    userId: string,
    id: string,
    _prevState: State,
    _formData: FormData
): Promise<State> {
    if (!IdSchema.safeParse(id).success) {
        return { message: 'Invalid customer id.' };
    }

    const result = await runMutation(
        () => deleteCustomer(userId, id),
        'deleteCustomerAction failed:'
    );
    return result ?? {};
}