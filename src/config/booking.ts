export const bookingTimeZone = "America/Guayaquil";

export function getBookingUrl(value: string | undefined): string | null {
  const candidate = value?.trim();
  if (!candidate) return null;

  const shortLink = /^https:\/\/calendar\.app\.google\/[a-zA-Z0-9_-]+\/?$/;
  const fullLink =
    /^https:\/\/calendar\.google\.com\/(?:calendar\/)?appointments\/schedules\/[a-zA-Z0-9_-]+\/?$/;

  if (!shortLink.test(candidate) && !fullLink.test(candidate)) return null;
  return candidate;
}
