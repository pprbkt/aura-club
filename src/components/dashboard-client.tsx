"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Home, LogOut, Settings, PlusCircle, History, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, Suspense } from "react";
import { AdminMenu } from "@/components/admin-menu";

export function DashboardClient({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  }

  const displayName = user.displayName || 'User';
  const isAdmin = user.role === 'admin';
  const isSuperAdmin = user.role === 'super_admin';
  const canUpload = user.canUpload && !isAdmin && !isSuperAdmin;

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border/40">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          {/* Member Navigation */}
          {(canUpload && !isAdmin) && (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Add Content" isActive={pathname.startsWith('/dashboard/add')}>
                  <Link href="/dashboard/add"><PlusCircle className="h-4 w-4" />Add Content</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Submission History" isActive={pathname === '/dashboard/history'}>
                  <Link href="/dashboard/history"><History className="h-4 w-4" />History</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}

          {/* Spacing above Dashboard */}
          {(isAdmin || isSuperAdmin) && (
            <div className="pt-12" />
          )}

          {/* Admin Navigation - Dashboard */}
          {(isAdmin || isSuperAdmin) && (
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === '/dashboard'}>
                      <Link href="/dashboard"><Home className="h-4 w-4" />Dashboard</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Admin Menu Items - Below Dashboard */}
          {(isAdmin || isSuperAdmin) && (
            <SidebarGroup className="mt-8">
              <SidebarGroupContent>
                <SidebarMenu>
                  <Suspense fallback={<div className="px-2 py-1 text-xs text-muted-foreground">Loading...</div>}>
                    <AdminMenu />
                  </Suspense>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Super Admin Navigation */}
          {isSuperAdmin && (
            <SidebarGroup className="mt-8">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Manage Admins" isActive={pathname === '/dashboard/super-admin'}>
                      <Link href="/dashboard/super-admin"><ShieldAlert className="h-4 w-4" />Manage Admins</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2 p-2 rounded-md border border-border/40">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photoURL || undefined} alt={displayName} />
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden flex-1">
              <p className="font-semibold text-xs truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings" isActive={pathname === '/dashboard/settings'}>
                <Link href="/dashboard/settings"><Settings className="h-4 w-4" />Settings</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                <LogOut className="h-4 w-4" />Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b border-border/40 bg-background">
          <SidebarTrigger className="-ml-1" />
          <Button asChild variant="outline" size="sm">
            <Link href="/">View Public Site</Link>
          </Button>
        </header>
        <main className="flex-1 overflow-auto bg-background">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
