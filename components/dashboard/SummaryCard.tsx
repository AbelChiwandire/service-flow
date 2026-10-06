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
            className={`block rounded-lg border p-4 transition hover:shadow-sm ${
                highlight ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
            }`}
        >
            <p className="text-sm text-gray-600">{label}</p>
            <p
                className={`mt-1 text-3xl font-semibold ${
                    highlight ? 'text-red-700' : 'text-gray-900'
                }`}
            >
                {value}
            </p>
        </Link>
    );
}