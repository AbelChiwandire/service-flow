import Link from 'next/link';

interface SummaryCardProps {
    label: string;
    value: number;
    href: string;
    // 'alert' highlights a number that needs attention, but only while it is above zero.
    tone?: 'default' | 'alert';
}

export default function SummaryCard({
    label,
    value,
    href,
    tone = 'default',
}: SummaryCardProps) {
    const highlight = tone === 'alert' && value > 0;

    return (
        <Link
            href={href}
            className={`group block rounded-lg border bg-white p-4 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                highlight
                    ? 'border-red-200 bg-red-50/50 hover:border-red-300 hover:bg-red-50'
                    : 'border-slate-200 hover:border-primary/40'
            }`}
        >
            <p
                className={`text-sm font-medium ${
                    highlight ? 'text-red-700' : 'text-slate-600'
                }`}
            >
                {label}
            </p>

            <p
                className={`mt-1 text-3xl font-semibold tracking-tight ${
                    highlight
                        ? 'text-red-700'
                        : 'text-slate-900 group-hover:text-primary'
                }`}
            >
                {value}
            </p>
        </Link>
    );
}