export const inquiryLimits = {
  objective: { min: 5, max: 100 },
  details: { min: 20, max: 1200 },
} as const;

export const timelines = ["exploring", "urgent", "one-to-three", "three-plus"] as const;

export interface InquiryDraft {
  readonly service: string;
  readonly objective: string;
  readonly details: string;
  readonly timeline: string;
}

export type InquiryField = keyof InquiryDraft;
