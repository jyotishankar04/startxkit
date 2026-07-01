import { PublicLayoutShell } from "./public-layout-shell";

function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayoutShell>{children}</PublicLayoutShell>;
}

export default PublicLayout;
