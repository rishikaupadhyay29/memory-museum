import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function MuseumLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <div className="min-h-screen bg-museum-obsidian">{children}</div>;
}
