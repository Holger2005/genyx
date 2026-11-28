import { parseSalesArguments } from "./sales/estimate.mjs";

try {
  const result = parseSalesArguments(process.argv.slice(2));
  const usd = (cents) => "$" + (cents / 100).toFixed(2);
  console.log("GENYX | Internal illustrative estimate");
  console.log("Service: " + result.service);
  console.log("Labor: " + usd(result.laborCents));
  console.log("Direct costs: " + usd(result.costsCents));
  console.log("Contingency: " + usd(result.contingencyCents));
  console.log("Estimated subtotal before taxes: " + usd(result.estimateCents));
  console.log("Review scope, taxes, recurring fees and terms before issuing a proposal.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
