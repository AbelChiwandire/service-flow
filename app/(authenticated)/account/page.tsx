import { notFound } from 'next/navigation';
import { getUserById } from '@/lib/db/users/repository';
import { requireUserId } from '@/lib/auth/session';
import UpdateProfileForm from './update-profile-form';
import DeleteAccountButton from './delete-account-button';
import ChangePasswordFormWrapper from './change-password-form';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
    const userId = await requireUserId();
    const user = await getUserById(userId);
    if (!user) {
        notFound();
    }

    return (
        <div className="max-w-xl space-y-6">
            <h1 className="text-xl font-semibold">Account</h1>
            <UpdateProfileForm
                initialValues={{
                    name: user.name,
                    businessName: user.businessName,
                    email: user.email,
                }}
            />
            <div className="border-t border-slate-200 pt-6">
                <h2 className="text-lg font-semibold mb-2">Change password</h2>
                <ChangePasswordFormWrapper />
            </div>
            <div className="border-t border-slate-200 pt-4">
                <DeleteAccountButton />
            </div>
        </div>
    );
}