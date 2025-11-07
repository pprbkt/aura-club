"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Home, LogOut, Settings, PlusCircle, History, ShieldAlert, Menu, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, Suspense } from "react";
import { AdminMenu } from "@/components/admin-menu";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

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
    <div className="flex h-screen w-full">
      {/* Sidebar - Always on top, z-50 */}
      <Sidebar className="border-r border-border/40 z-50">
        <SidebarContent className="overflow-y-auto pt-4">
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
            <SidebarGroup>
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
            <SidebarGroup>
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
        <SidebarFooter className="border-t border-border/40 space-y-3">
          {/* View Public Site Button */}
          <SidebarMenu>
            <SidebarMenuItem>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/" className="justify-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Public Site
                </Link>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* User Info */}
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

          {/* Settings and Logout */}
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

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 border-b border-border/40 bg-background flex-shrink-0 sticky top-0 z-40">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleSidebar()}
            className="h-9 w-9"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function DashboardClient({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
      <Toaster />
    </SidebarProvider>
  );
}
