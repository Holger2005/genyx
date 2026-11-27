export function getWhatsAppNumber(value: string | undefined): string | null {
  const number = value?.trim();
  if (!number || !/^[1-9][0-9]{7,14}$/.test(number)) return null;
  return number;
}
