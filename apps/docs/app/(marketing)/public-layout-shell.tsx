"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

export function PublicLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDocsRoute = pathname === "/docs" || pathname.startsWith("/docs/");

  if (isDocsRoute) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
