"use client";

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/hooks/use-auth';
import { ShopProvider } from '@/hooks/use-shop';
import { Header } from './header';
import { Footer } from './footer';
import { Toaster } from '@/components/ui/toaster';

interface ClientProviderProps {
  children: ReactNode;
}

export function ClientProvider({ children }: ClientProviderProps) {
  return (
    <AuthProvider>
      <ShopProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
      </ShopProvider>
    </AuthProvider>
  );
}
