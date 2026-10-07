// mock dashboard page for testing the AppHeader and AppSidebar
import { PageHeader } from "@/components/PageHeader";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your active jobs, customers, and invoicing activity."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Customers</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">24</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Open jobs</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">12</p>
        </div>
      </div>
    </>
  );
}