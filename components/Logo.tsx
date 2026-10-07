import Link from "next/link";

type LogoProps = {
  href: string;
  label: string;
};

export function Logo({ href, label }: LogoProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2667FF]"
      aria-label={label}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2667FF] text-lg font-bold text-white">
        S
      </span>

      <span className="text-xl font-bold tracking-tight text-slate-900">
        Service<span className="text-[#2667FF]">Flow</span>
      </span>
    </Link>
  );
}