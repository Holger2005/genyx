export const leadStages = ["new", "contacted", "consultation", "proposal", "won", "lost"] as const;
export type LeadStage = (typeof leadStages)[number];

const services = ["web", "mobile", "enterprise", "ai", "automation", "integrations"] as const;
const timelines = ["exploring", "urgent", "one-to-three", "three-plus"] as const;
type Service = (typeof services)[number];
type Timeline = (typeof timelines)[number];

export interface TestLead {
  readonly id: string;
  readonly locale: "es" | "en";
  readonly service: Service;
  readonly timeline: Timeline;
  readonly priority: "high" | "normal" | "low";
}

export interface Lead extends TestLead {
  readonly stage: LeadStage;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface LeadEvent {
  readonly stage: LeadStage;
  readonly occurredAt: string;
}

export function isLeadStage(value: string): value is LeadStage {
  return leadStages.some((stage) => stage === value);
}

export function canTransition(from: LeadStage, to: LeadStage): boolean {
  if (from === "won" || from === "lost") return false;
  if (to === "lost") return true;
  return leadStages.indexOf(to) === leadStages.indexOf(from) + 1;
}

export function parseTestLead(input: unknown): TestLead {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Expected a synthetic test record");
  }
  const body = input as Record<string, unknown>;
  const keys = [
    "schemaVersion",
    "testOnly",
    "source",
    "requestId",
    "locale",
    "service",
    "timeline",
  ];
  const service = services.find((item) => item === body.service);
  const timeline = timelines.find((item) => item === body.timeline);
  const id = body.requestId;
  if (
    Object.keys(body).length !== keys.length ||
    !Object.keys(body).every((key) => keys.includes(key)) ||
    body.schemaVersion !== 1 ||
    body.testOnly !== true ||
    body.source !== "genyx-test" ||
    typeof id !== "string" ||
    !/^genyx-test-[a-z0-9-]{1,48}$/.test(id) ||
    (body.locale !== "es" && body.locale !== "en") ||
    !service ||
    !timeline
  ) {
    throw new Error("Invalid synthetic test record");
  }
  return {
    id,
    locale: body.locale,
    service,
    timeline,
    priority: timeline === "urgent" ? "high" : timeline === "exploring" ? "low" : "normal",
  };
}
