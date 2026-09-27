import Link from "next/link";

const navigationLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/customers", label: "Customers" },
  { href: "/jobs", label: "Jobs" },
  { href: "/invoices", label: "Invoices" },
];

export function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex flex-wrap items-center gap-1 sm:gap-2">
        {navigationLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-[#2667FF]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}