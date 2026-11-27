import {
  inquiryLimits,
  timelines,
  type InquiryDraft,
  type InquiryField,
} from "../../domain/inquiry/inquiry";

export type InquiryResult =
  | { readonly ok: true; readonly value: InquiryDraft }
  | { readonly ok: false; readonly errors: readonly InquiryField[] };

export function prepareInquiry(draft: InquiryDraft, serviceIds: readonly string[]): InquiryResult {
  const value = {
    service: draft.service.trim(),
    objective: draft.objective.trim(),
    details: draft.details.trim(),
    timeline: draft.timeline.trim(),
  };
  const errors: InquiryField[] = [];

  if (!serviceIds.includes(value.service)) errors.push("service");
  if (
    value.objective.length < inquiryLimits.objective.min ||
    value.objective.length > inquiryLimits.objective.max
  ) {
    errors.push("objective");
  }
  if (
    value.details.length < inquiryLimits.details.min ||
    value.details.length > inquiryLimits.details.max
  ) {
    errors.push("details");
  }
  if (!timelines.some((timeline) => timeline === value.timeline)) errors.push("timeline");

  return errors.length ? { ok: false, errors } : { ok: true, value };
}
