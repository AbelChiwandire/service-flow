'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const COOKIE = 'tz';

// Stores the browser's time zone in a cookie so the server can work out the user's "today".
export function TimeZoneSync() {
    const router = useRouter();

    useEffect(() => {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const current = document.cookie
            .split('; ')
            .find((c) => c.startsWith(`${COOKIE}=`))
            ?.split('=')[1];

        if (tz && decodeURIComponent(current ?? '') !== tz) {
            document.cookie = `${COOKIE}=${encodeURIComponent(tz)}; path=/; max-age=31536000; samesite=lax`;
            router.refresh();
        }
    }, [router]);

    return null;
}
