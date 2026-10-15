import Link from "next/link";

type LogoProps = {
    href: string;
    label: string;
    titleClassName?: string;
};

export function Logo({ href, label, titleClassName = "" }: LogoProps) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            aria-label={label}
        >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-lg font-bold text-white">
                S
            </span>

            <span className={`text-xl font-bold tracking-tight text-foreground ${titleClassName}`}>
                Service<span className="text-navy">Flow</span>
            </span>
        </Link>
    );
}
