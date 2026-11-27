import { DatabaseSync } from "node:sqlite";
import type { LeadRepository } from "../../application/crm/lead-repository";
import type { Lead, LeadEvent, LeadStage, TestLead } from "../../domain/crm/lead";

const selectLead = `
  SELECT id, locale, service, timeline, priority, stage,
    created_at AS createdAt, updated_at AS updatedAt
  FROM leads
`;

export class SqliteLeadRepository implements LeadRepository {
  private readonly db: DatabaseSync;

  constructor(path: string) {
    this.db = new DatabaseSync(path);
    this.db.exec(`
      PRAGMA foreign_keys = ON;
      PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY NOT NULL CHECK (id LIKE 'genyx-test-%'),
        locale TEXT NOT NULL CHECK (locale IN ('es','en')),
        service TEXT NOT NULL CHECK (service IN
          ('web','mobile','enterprise','ai','automation','integrations')),
        timeline TEXT NOT NULL CHECK (timeline IN
          ('exploring','urgent','one-to-three','three-plus')),
        priority TEXT NOT NULL CHECK (priority IN ('high','normal','low')),
        stage TEXT NOT NULL CHECK (stage IN
          ('new','contacted','consultation','proposal','won','lost')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      ) STRICT;
      CREATE TABLE IF NOT EXISTS lead_events (
        sequence INTEGER PRIMARY KEY,
        lead_id TEXT NOT NULL REFERENCES leads(id),
        stage TEXT NOT NULL CHECK (stage IN
          ('new','contacted','consultation','proposal','won','lost')),
        occurred_at TEXT NOT NULL
      ) STRICT;
    `);
  }

  close() {
    this.db.close();
  }

  private transaction<T>(operation: () => T): T {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const result = operation();
      this.db.exec("COMMIT");
      return result;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  private event(id: string, stage: LeadStage, now: string) {
    this.db
      .prepare("INSERT INTO lead_events (lead_id, stage, occurred_at) VALUES (?, ?, ?)")
      .run(id, stage, now);
  }

  create(lead: TestLead, now: string): Lead {
    return this.transaction(() => {
      const previous = this.find(lead.id);
      if (previous) {
        if (
          previous.service !== lead.service ||
          previous.locale !== lead.locale ||
          previous.timeline !== lead.timeline ||
          previous.priority !== lead.priority
        ) {
          throw new Error("Conflicting synthetic request ID");
        }
        return previous;
      }
      this.db
        .prepare(
          `
          INSERT INTO leads (id, locale, service, timeline, priority, stage, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, 'new', ?, ?)
        `,
        )
        .run(lead.id, lead.locale, lead.service, lead.timeline, lead.priority, now, now);
      this.event(lead.id, "new", now);
      return { ...lead, stage: "new", createdAt: now, updatedAt: now };
    });
  }

  find(id: string): Lead | undefined {
    return this.db.prepare(selectLead + " WHERE id = ?").get(id) as unknown as Lead | undefined;
  }

  list(): readonly Lead[] {
    return this.db.prepare(selectLead + " ORDER BY created_at, id").all() as unknown as Lead[];
  }

  history(id: string): readonly LeadEvent[] {
    return this.db
      .prepare(
        "SELECT stage, occurred_at AS occurredAt FROM lead_events WHERE lead_id = ? ORDER BY sequence",
      )
      .all(id) as unknown as LeadEvent[];
  }

  transition(id: string, expected: LeadStage, next: LeadStage, now: string): Lead {
    return this.transaction(() => {
      const changed = this.db
        .prepare("UPDATE leads SET stage = ?, updated_at = ? WHERE id = ? AND stage = ?")
        .run(next, now, id, expected);
      if (Number(changed.changes) !== 1) throw new Error("Lead changed or no longer exists");
      this.event(id, next, now);
      const updated = this.find(id);
      if (!updated) throw new Error("Lead not found after update");
      return updated;
    });
  }
}
