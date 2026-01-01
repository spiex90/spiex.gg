import { redirect } from "next/navigation";
import { SITE } from "../lib/site";

export default function LiveRedirect() {
  redirect(SITE.urls.live);
}
