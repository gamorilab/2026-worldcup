import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, getSafeLocale } from "@/lib/i18n/config";

export default async function Home() {
  const cookieStore = await cookies();
  const preferredLocale = getSafeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);
  redirect(`/${preferredLocale || DEFAULT_LOCALE}`);
}
