import Link from 'next/link';
import UpdateCustomerForm from '../../app/(authenticated)/customers/[id]/edit/update-customer-form';

type CustomerValues = {
    name: string;
    email: string;
    phone: string;
    address: string;
};

type EditCustomerFormProps = {
    customerId: string;
    initialValues: CustomerValues | null;
};

export default function EditCustomerForm({
    customerId,
    initialValues,
}: EditCustomerFormProps) {
    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <Link
                    href={`/customers/${encodeURIComponent(customerId)}`}
                    className="inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-[#2667FF] underline-offset-4 hover:text-[#3F8EFC] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2667FF] focus-visible:ring-offset-2"
                >
                    <span aria-hidden="true" className="mr-2">
                        ←
                    </span>
                    Back to customer
                </Link>

                <header className="mb-8 mt-6">
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                        Edit customer
                    </h1>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                        Update this customer&apos;s contact information.
                    </p>
                </header>

                {initialValues ? (
                    <UpdateCustomerForm
                        customerId={customerId}
                        initialValues={initialValues}
                    />
                ) : (
                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="text-xl font-semibold text-slate-950">
                            Customer not found
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            This customer may have been removed or is not available.
                        </p>
                    </section>
                )}
            </div>
        </main>
    );
}
