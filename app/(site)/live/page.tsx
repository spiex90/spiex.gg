import { redirect } from "next/navigation";
import { SITE } from "@/app/lib/site";

export default function LiveRedirect() {
  redirect(SITE.urls.live);
}
