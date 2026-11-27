import { redirect } from "next/navigation";
import { site } from "../../config/site";

export default function Entry() {
  redirect(`/${site.defaultLocale}`);
}
