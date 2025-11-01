
"use client";

import { AuthProvider } from "@/hooks/use-auth";
import { PageShell } from "./page-shell";

export function ClientProvider({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <PageShell>{children}</PageShell>
        </AuthProvider>
    );
}
