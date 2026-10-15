import Link from "next/link";

export function BackLink({ href, label }: { href: string; label: string }) {
    return (
        <Link href={href} className="mb-4 inline-flex items-center gap-1 text-sm link-subtle">
            <span aria-hidden="true" className="icon-mask icon-mask-back h-5 w-5 shrink-0" />
            {label}
        </Link>
    );
}
