'use server';

import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
    createUser,
    updateUser,
    deleteUser,
    EmailAlreadyExistsError,
    getUserAuthById,
    updatePassword
} from './repository';
import {
    SignupFormSchema,
    UserProfileFormSchema,
    IdSchema,
    formatValidationErrors,
    type UserFormErrors,
    type PasswordChangeErrors,
    formatPasswordChangeErrors,
    PasswordChangeFormSchema,
} from './schema';

const SALT_ROUNDS = 10;

export type State = {
    errors?: UserFormErrors;
    message?: string | null;
    values?: {
        name?: string;
        businessName?: string;
        email?: string;
    };
};

export type PasswordChangeState = {
    errors?: PasswordChangeErrors;
    message?: string | null;
};

function getRawSignupValues(formData: FormData): State['values'] {
    return {
        name: formData.get('name')?.toString(),
        businessName: formData.get('businessName')?.toString(),
        email: formData.get('email')?.toString(),
        // password/confirmPassword deliberately excluded
    };
}

export async function signupAction(prevState: State, formData: FormData): Promise<State> {
    const validatedData = SignupFormSchema.safeParse({
        name: formData.get('name'),
        businessName: formData.get('businessName'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    });

    if (!validatedData.success) {
        return {
            errors: formatValidationErrors(validatedData.error),
            message: 'Missing or invalid fields. Failed to sign up.',
            values: getRawSignupValues(formData),
        };
    }

    const { name, businessName, email, password } = validatedData.data;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    try {
        await createUser({ name, businessName, email, passwordHash });
    } catch (error) {
        if (error instanceof EmailAlreadyExistsError) {
            return {
                errors: { email: [error.message] },
                message: error.message,
                values: getRawSignupValues(formData),
            };
        }
        console.error('signupAction failed:', error);
        throw error;
    }

    // TODO: once auth exists, log the new user in here instead of redirecting to a login page
    redirect('/login');
}

export async function updateUserProfileAction(
    id: string,
    prevState: State,
    formData: FormData
): Promise<State> {
    if (!IdSchema.safeParse(id).success) {
        return { message: 'Invalid user id.' };
    }

    const validatedData = UserProfileFormSchema.safeParse({
        name: formData.get('name'),
        businessName: formData.get('businessName'),
        email: formData.get('email'),
    });

    if (!validatedData.success) {
        return {
            errors: formatValidationErrors(validatedData.error),
            message: 'Missing or invalid fields. Failed to update profile.',
            values: getRawSignupValues(formData),
        };
    }

    try {
        const user = await updateUser(id, validatedData.data);
        if (!user) {
            return { message: 'User not found.' };
        }
    } catch (error) {
        if (error instanceof EmailAlreadyExistsError) {
            return {
                errors: { email: [error.message] },
                message: error.message,
                values: getRawSignupValues(formData),
            };
        }
        console.error('updateUserProfileAction failed:', error);
        throw error;
    }

    // PLACEHOLDER: redirect to actual user profile page after update
    revalidatePath('/account');
    redirect('/account');
}

export async function changePasswordAction(
    userId: string,
    prevState: PasswordChangeState,
    formData: FormData
): Promise<PasswordChangeState> {
    const validatedData = PasswordChangeFormSchema.safeParse({
        currentPassword: formData.get('currentPassword'),
        newPassword: formData.get('newPassword'),
        confirmNewPassword: formData.get('confirmNewPassword'),
    });

    if (!validatedData.success) {
        return {
            errors: formatPasswordChangeErrors(validatedData.error),
            message: 'Missing or invalid fields. Failed to change password.',
        };
    }

    const { currentPassword, newPassword } = validatedData.data;

    const user = await getUserAuthById(userId);
    if (!user) {
        return { message: 'User not found.' };
    }

    const currentPasswordMatches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!currentPasswordMatches) {
        return {
            errors: { currentPassword: ['Current password is incorrect.'] },
            message: 'Current password is incorrect.',
        };
    }

    const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    try {
        await updatePassword(userId, newPasswordHash);
    } catch (error) {
        console.error('changePasswordAction failed:', error);
        throw error;
    }

    revalidatePath('/account');
    redirect('/account');
}

export async function deleteUserAction(
    id: string,
    _prevState: State,
    _formData: FormData
): Promise<State> {
    if (!IdSchema.safeParse(id).success) {
        return { message: 'Invalid user id.' };
    }

    try {
        const user = await deleteUser(id);
        if (!user) {
            return { message: 'User not found.' };
        }
    } catch (error) {
        console.error('deleteUserAction failed:', error);
        throw error;
    }

    // TODO: once auth exists, clear the session here before redirecting
    redirect('/');
}

// SECURITY GAP — NOT PRODUCTION SAFE:
// updateUserProfileAction and deleteUserAction take `id` as a plain argument
// bound from PLACEHOLDER_USER_ID. Once auth exists, `id` must come from the
// verified session, not be passed in from the caller/page at all — otherwise
// a forged bind() call could act on another user's account.