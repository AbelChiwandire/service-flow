// PLACEHOLDER: Dashboard page for authenticated users
// This is for testing purposes only
import { SignOutButton } from '@/components/SignoutButton';

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-7">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        </div>
        <p className="text-slate-700 mb-6">Welcome to the dashboard. You are authenticated.</p>
        <SignOutButton />
      </section>
    </main>
  );
}