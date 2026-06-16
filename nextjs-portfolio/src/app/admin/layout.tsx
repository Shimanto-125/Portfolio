import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEURAL_PORTFOLIO | Admin Dashboard",
  description: "Admin dashboard for managing portfolio content",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
