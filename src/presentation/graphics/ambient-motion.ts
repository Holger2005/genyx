export function normalizedPointer(value: number, start: number, extent: number) {
  if (
    !Number.isFinite(value) ||
    !Number.isFinite(start) ||
    !Number.isFinite(extent) ||
    extent <= 0
  ) {
    return 0;
  }
  return Math.max(-1, Math.min(1, ((value - start) / extent) * 2 - 1));
}
