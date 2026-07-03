import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import MasterClient from "./MasterClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "마스터 설정",
    robots: { index: false, follow: false, nocache: true, noimageindex: true },
  };
}

export default async function MasterPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/");
  return <MasterClient />;
}
