import { describe, expect, it } from "vitest";
import { normalizedPointer } from "../../src/presentation/graphics/ambient-motion";

describe("ambient pointer", () => {
  it("normalizes coordinates and clamps out-of-bounds positions", () => {
    expect(normalizedPointer(100, 100, 200)).toBe(-1);
    expect(normalizedPointer(200, 100, 200)).toBe(0);
    expect(normalizedPointer(300, 100, 200)).toBe(1);
    expect(normalizedPointer(0, 100, 200)).toBe(-1);
    expect(normalizedPointer(500, 100, 200)).toBe(1);
  });

  it("returns a neutral position for invalid dimensions or values", () => {
    expect(normalizedPointer(20, 0, 0)).toBe(0);
    expect(normalizedPointer(20, 0, -1)).toBe(0);
    expect(normalizedPointer(Number.NaN, 0, 100)).toBe(0);
    expect(normalizedPointer(20, Number.POSITIVE_INFINITY, 100)).toBe(0);
    expect(normalizedPointer(20, 0, Number.POSITIVE_INFINITY)).toBe(0);
  });
});
