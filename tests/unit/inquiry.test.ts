import { describe, expect, it } from "vitest";
import { prepareInquiry } from "../../src/application/inquiry/prepare-inquiry";
import type { InquiryDraft } from "../../src/domain/inquiry/inquiry";

const draft: InquiryDraft = {
  service: "web",
  objective: "Improve our website",
  details: "Create a catalog for our business.",
  timeline: "exploring",
};

describe("project inquiry", () => {
  it("normalizes a valid draft", () => {
    expect(prepareInquiry({ ...draft, objective: "  Improve our website  " }, ["web"])).toEqual({
      ok: true,
      value: draft,
    });
  });

  it("rejects invalid services, empty objectives and invalid timelines", () => {
    expect(
      prepareInquiry({ service: "unknown", objective: "", details: "", timeline: "" }, ["web"]),
    ).toEqual({
      ok: false,
      errors: ["service", "objective", "details", "timeline"],
    });
  });

  it("rejects excessively long descriptions", () => {
    const result = prepareInquiry(
      { ...draft, objective: "x".repeat(101), details: "x".repeat(1201) },
      ["web"],
    );
    expect(result).toEqual({ ok: false, errors: ["objective", "details"] });
  });
});
