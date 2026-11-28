import Link from "next/link";
import { redirect } from "next/navigation";
import { site } from "../../config/site";

export const metadata = { robots: { index: false, follow: false } };

export default function Entry() {
  if (process.env.GENYX_STATIC_EXPORT !== "1") {
    redirect(`/${site.defaultLocale}`);
  }
  return (
    <main>
      <h1>Genyx</h1>
      <p>Selecciona tu idioma / Choose your language.</p>
      <Link href="/es">Español</Link> <Link href="/en">English</Link>
    </main>
  );
}
