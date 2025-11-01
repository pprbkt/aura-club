
"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from "@/components/ui/toaster";

export function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <>
      <div className="relative flex min-h-dvh flex-col bg-background">
        {!isDashboard && <Header />}
        <main className="flex-1">{children}</main>
        {!isDashboard && <Footer />}
      </div>
      <Toaster />
    </>
  );
}
