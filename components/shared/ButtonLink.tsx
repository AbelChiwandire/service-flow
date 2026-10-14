import Link from "next/link";
import type { ReactNode } from "react";

const variants = {
  primary: "bg-[#2667FF] text-white font-semibold hover:bg-[#3F8EFC]",
  secondary:
    "border border-slate-300 bg-white text-slate-700 font-medium hover:border-[#2667FF] hover:text-[#2667FF]",
};

type ButtonLinkProps = {
  href: string;
  variant?: keyof typeof variants;
  children: ReactNode;
};

export function ButtonLink({ href, variant = "primary", children }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex h-10 items-center justify-center rounded-md px-4 text-sm transition-colors ${variants[variant]}`}
    >
      {children}
    </Link>
  );
}