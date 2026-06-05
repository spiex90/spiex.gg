import { redirect } from "next/navigation";
import { SITE } from "@/app/lib/site";

export default function DiscordRedirect() {
  redirect(SITE.urls.discord);
}
