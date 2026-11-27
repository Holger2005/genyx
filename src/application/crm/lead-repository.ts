import { canTransition, isLeadStage, parseTestLead } from "../../domain/crm/lead.ts";
import type { Lead, LeadEvent, LeadStage, TestLead } from "../../domain/crm/lead";

export interface LeadRepository {
  create(lead: TestLead, now: string): Lead;
  find(id: string): Lead | undefined;
  list(): readonly Lead[];
  history(id: string): readonly LeadEvent[];
  transition(id: string, expected: LeadStage, next: LeadStage, now: string): Lead;
}

export function recordTestLead(repository: LeadRepository, input: unknown, now: string): Lead {
  return repository.create(parseTestLead(input), now);
}

export function moveLead(repository: LeadRepository, id: string, next: string, now: string): Lead {
  const lead = repository.find(id);
  if (!lead) throw new Error("Lead not found");
  if (!isLeadStage(next) || !canTransition(lead.stage, next)) {
    throw new Error("Invalid stage transition");
  }
  return repository.transition(id, lead.stage, next, now);
}
