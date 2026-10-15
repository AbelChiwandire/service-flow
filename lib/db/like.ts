// Escape LIKE wildcards so a search for "50%" matches literally.
export function escapeLike(value: string): string {
    return value.replace(/[\\%_]/g, "\\$&");
}
