const APP_TIME_ZONE = process.env.APP_TIME_ZONE ?? 'UTC';

/** Today's calendar date as 'YYYY-MM-DD' in the app's time zone. */
export function getToday(): string {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: APP_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date());
}