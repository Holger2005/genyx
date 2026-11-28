import { checkHostedPreview } from "./hosted-preview.mjs";

try {
  const result = await checkHostedPreview();
  console.log("GENYX hosted preview checks passed");
  console.log("Localized pages: " + result.pages);
  console.log("Calendar link present: " + result.channels.booking);
  console.log("WhatsApp link present: " + result.channels.whatsapp);
  console.log("Manually verify ownership, destination and availability before commercial use.");
} catch {
  console.error("Hosted preview check failed. Review routes and deployment headers.");
  process.exitCode = 1;
}
