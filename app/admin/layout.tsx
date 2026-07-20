import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { AdminNav } from "@/components/admin-nav";
import { AdminToast } from "@/components/admin-toast";

type AdminNotice = {
  type: "success" | "error";
  message: string;
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const initialNotice = await getInitialNotice();

  return (
    <>
      <AdminToast initialNotice={initialNotice} />
      <AdminNav />
      {children}
    </>
  );
}

async function getInitialNotice(): Promise<AdminNotice | null> {
  const cookieStore = await cookies();
  const rawNotice = cookieStore.get("admin_notice")?.value;

  if (!rawNotice) {
    return null;
  }

  try {
    const notice = JSON.parse(decodeURIComponent(rawNotice)) as AdminNotice;

    if (
      (notice.type === "success" || notice.type === "error") &&
      typeof notice.message === "string"
    ) {
      return notice;
    }
  } catch {
    return null;
  }

  return null;
}
