import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin-nav";
import { AdminToast } from "@/components/admin-toast";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminToast />
      <AdminNav />
      {children}
    </>
  );
}
