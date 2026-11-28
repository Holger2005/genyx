const services = ["web", "mobile", "enterprise", "ai", "automation", "integrations"];

function integer(value, min, max, label) {
  if (!Number.isSafeInteger(value) || value < min || value > max) {
    throw new Error("Invalid " + label);
  }
  return value;
}

export function estimateProject(input) {
  const { service, hours, hourlyCents, costsCents, contingencyPercent } = input;
  if (!services.includes(service)) throw new Error("Unknown service");
  integer(hours, 1, 10000, "hours");
  integer(hourlyCents, 1, 1000000, "hourly rate");
  integer(costsCents, 0, 100000000, "direct costs");
  integer(contingencyPercent, 0, 100, "contingency");

  const laborCents = hours * hourlyCents;
  const subtotalCents = laborCents + costsCents;
  const contingencyCents = Math.ceil((subtotalCents * contingencyPercent) / 100);
  return {
    service,
    laborCents,
    costsCents,
    contingencyCents,
    estimateCents: subtotalCents + contingencyCents,
  };
}

export function parseSalesArguments(args) {
  if (args.length !== 5 || !args.slice(1).every((value) => /^[0-9]+$/.test(value))) {
    throw new Error(
      "Use: sales:estimate -- service hours hourlyCents costsCents contingencyPercent",
    );
  }
  const [service, hours, hourlyCents, costsCents, contingencyPercent] = args;
  return estimateProject({
    service,
    hours: Number(hours),
    hourlyCents: Number(hourlyCents),
    costsCents: Number(costsCents),
    contingencyPercent: Number(contingencyPercent),
  });
}
