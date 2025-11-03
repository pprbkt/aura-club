import { Suspense } from 'react';
import { DashboardClient } from '@/components/dashboard-client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <DashboardClient>{children}</DashboardClient>
    </Suspense>
  );
}
