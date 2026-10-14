import Image from "next/image";
import Link from "next/link";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-[#2667FF]"
    >
      <Image src="/back-svgrepo-com.svg" alt="" width={20} height={20} aria-hidden="true" />
      {label}
    </Link>
  );
}