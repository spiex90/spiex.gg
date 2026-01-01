import { redirect } from "next/navigation";
import { SITE } from "../lib/site";

export default function DiscordRedirect() {
  redirect(SITE.urls.discord);
}
