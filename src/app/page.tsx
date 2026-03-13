import { redirect } from "next/navigation";

export default function Home() {
  // For now, redirect to the app shell at /type until landing page is built
  redirect("/type");
}
