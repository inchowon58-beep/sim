import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO 서브페이지 관리",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell">
      <div className="admin-shell-inner">{children}</div>
    </div>
  );
}
