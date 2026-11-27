import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import fixture from "../../automation/n8n/fixtures/intake-test.json";
import { moveLead, recordTestLead } from "../../src/application/crm/lead-repository";
import { canTransition, isLeadStage, parseTestLead } from "../../src/domain/crm/lead";
import { SqliteLeadRepository } from "../../src/infrastructure/crm/sqlite-lead-repository";

const now = "2026-11-26T12:00:00.000Z";
const later = "2026-11-26T12:30:00.000Z";

describe("synthetic CRM", () => {
  it("validates the test-only contract and classifies priority", () => {
    expect(parseTestLead(fixture).priority).toBe("high");
    expect(parseTestLead({ ...fixture, timeline: "exploring" }).priority).toBe("low");
    expect(parseTestLead({ ...fixture, timeline: "three-plus" }).priority).toBe("normal");
    for (const invalid of [
      null,
      [],
      {},
      { ...fixture, testOnly: false },
      { ...fixture, source: "real" },
      { ...fixture, schemaVersion: 2 },
      { ...fixture, requestId: "customer" },
      { ...fixture, locale: "fr" },
      { ...fixture, service: "unknown" },
      { ...fixture, timeline: "unknown" },
      { ...fixture, email: "test@example.invalid" },
    ]) {
      expect(() => parseTestLead(invalid)).toThrow();
    }
  });

  it("stores a lead once and prevents conflicting IDs", () => {
    const repository = new SqliteLeadRepository(":memory:");
    try {
      const lead = recordTestLead(repository, fixture, now);
      expect(lead.stage).toBe("new");
      expect(recordTestLead(repository, fixture, later)).toEqual(lead);
      expect(repository.list()).toEqual([lead]);
      expect(repository.history(lead.id)).toEqual([{ stage: "new", occurredAt: now }]);
      expect(() => recordTestLead(repository, { ...fixture, service: "web" }, later)).toThrow(
        "Conflicting synthetic request ID",
      );
    } finally {
      repository.close();
    }
  });

  it("enforces forward stage transitions and records the history", () => {
    const repository = new SqliteLeadRepository(":memory:");
    try {
      const lead = recordTestLead(repository, fixture, now);
      expect(() => moveLead(repository, "missing", "contacted", later)).toThrow("Lead not found");
      expect(() => moveLead(repository, lead.id, "won", later)).toThrow("Invalid stage");
      expect(() => moveLead(repository, lead.id, "unknown", later)).toThrow("Invalid stage");
      for (const stage of ["contacted", "consultation", "proposal", "won"]) {
        expect(moveLead(repository, lead.id, stage, later).stage).toBe(stage);
      }
      expect(repository.history(lead.id).map((event) => event.stage)).toEqual([
        "new",
        "contacted",
        "consultation",
        "proposal",
        "won",
      ]);
      expect(() => moveLead(repository, lead.id, "lost", later)).toThrow("Invalid stage");
      expect(canTransition("new", "lost")).toBe(true);
      expect(canTransition("lost", "new")).toBe(false);
      expect(isLeadStage("invalid")).toBe(false);
      expect(() => repository.transition(lead.id, "new", "contacted", later)).toThrow(
        "Lead changed",
      );
    } finally {
      repository.close();
    }
  });

  it("persists the record and events across database connections", () => {
    const directory = mkdtempSync(join(tmpdir(), "genyx-crm-test-"));
    const path = join(directory, "test.sqlite");
    try {
      const first = new SqliteLeadRepository(path);
      try {
        const lead = recordTestLead(first, fixture, now);
        moveLead(first, lead.id, "contacted", later);
      } finally {
        first.close();
      }
      const reopened = new SqliteLeadRepository(path);
      try {
        expect(reopened.find(fixture.requestId)?.stage).toBe("contacted");
        expect(reopened.history(fixture.requestId)).toHaveLength(2);
      } finally {
        reopened.close();
      }
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
