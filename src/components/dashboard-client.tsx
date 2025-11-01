
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
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Home, LogOut, Settings, PlusCircle, History, Users, GitPullRequest, Library, FolderKanban, Calendar, Newspaper, Trash2, UserCog, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { AdminMenu } from "@/components/admin-menu";

export function DashboardClient({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === '/dashboard'}>
                <Link href="/dashboard"><Home />Dashboard</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {(canUpload && !isAdmin) && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Add Content" isActive={pathname.startsWith('/dashboard/add')}>
                  <Link href="/dashboard/add"><PlusCircle />Add Content</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {(canUpload && !isAdmin) && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Submission History" isActive={pathname === '/dashboard/history'}>
                  <Link href="/dashboard/history"><History />History</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>

          {(isAdmin || isSuperAdmin) && (
            <Suspense fallback={<div>Loading...</div>}>
              <AdminMenu />
            </Suspense>
          )}

          {isSuperAdmin && (
            <SidebarGroup>
              <SidebarGroupLabel>Super Admin</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Manage Admins" isActive={pathname === '/dashboard/super-admin'}>
                      <Link href="/dashboard/super-admin"><ShieldAlert />Manage Admins</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 p-2">
            <Avatar>
              <AvatarImage src={user.photoURL || undefined} alt={displayName} />
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings" isActive={pathname === '/dashboard/settings'}>
                <Link href="/dashboard/settings"><Settings />Settings</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                <LogOut />Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <SidebarTrigger />
          <Button asChild variant="outline">
            <Link href="/">View Public Site</Link>
          </Button>
        </header>
        <div className="p-4 md:p-8">
          {children}
          <Toaster />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
