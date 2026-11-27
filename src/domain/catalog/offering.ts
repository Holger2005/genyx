import type { Locale } from "../locale";

export interface OfferingCopy {
  readonly title: string;
  readonly description: string;
  readonly audience: string;
  readonly deliverables: readonly string[];
}

export interface Service {
  readonly slug: string;
  readonly content: Readonly<Record<Locale, OfferingCopy>>;
}

export interface Product extends Service {
  readonly status: "draft" | "review" | "available";
}

export interface PublicOffering extends OfferingCopy {
  readonly slug: string;
}
