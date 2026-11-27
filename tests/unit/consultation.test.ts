import { describe, expect, it } from "vitest";
import { consultation } from "../../src/domain/consultation/consultation";

describe("initial consultation", () => {
  it("defines a free thirty-minute agenda", () => {
    expect(consultation.priceUsd).toBe(0);
    expect(consultation.durationMinutes).toBe(30);
    expect(consultation.agenda.reduce((total, item) => total + item.minutes, 0)).toBe(
      consultation.durationMinutes,
    );
    expect(new Set(consultation.agenda.map((item) => item.id)).size).toBe(3);
  });
});
