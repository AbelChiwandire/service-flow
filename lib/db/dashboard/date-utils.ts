import { cookies } from 'next/headers';

export const TIME_ZONE_COOKIE = 'tz';

const FALLBACK_TIME_ZONE = process.env.APP_TIME_ZONE ?? 'UTC';

function isValidTimeZone(timeZone: string | undefined): timeZone is string {
    if (!timeZone) return false;
    try {
        new Intl.DateTimeFormat('en-CA', { timeZone });
        return true;
    } catch {
        return false;
    }
}

// Today's calendar date as 'YYYY-MM-DD' in the given time zone. 
export function getToday(timeZone: string = FALLBACK_TIME_ZONE): string {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date());
}

// Today's date in the user's time zone (from the tz cookie), else APP_TIME_ZONE/UTC.
export async function getTodayForRequest(): Promise<string> {
    const tz = (await cookies()).get(TIME_ZONE_COOKIE)?.value;
    return getToday(isValidTimeZone(tz) ? tz : FALLBACK_TIME_ZONE);
}
