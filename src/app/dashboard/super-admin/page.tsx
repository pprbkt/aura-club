"use client";

import { useAuth, type UserRole } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { UpdateRoleSelect } from "@/components/update-role-select";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function SuperAdminPage() {
  const { user, users, updateUserRole } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'super_admin') {
      router.push('/dashboard');
    }
  }, [user, router]);
  
  if (!user || user.role !== 'super_admin') {
    return <div className="flex h-screen items-center justify-center">Access Denied</div>;
  }

  // Sort users by role hierarchy: super_admin → admin → member → user
  const sortedUsers = useMemo(() => {
    const roleOrder: { [key in UserRole]: number } = {
      'super_admin': 1,
      'admin': 2,
      'member': 3,
      'user': 4,
    };

    return users
      .filter(u => u.email !== user.email)
      .sort((a, b) => {
        const roleComparison = roleOrder[a.role] - roleOrder[b.role];
        if (roleComparison !== 0) return roleComparison;
        // If same role, sort alphabetically by name
        return a.name.localeCompare(b.name);
      });
  }, [users, user.email]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold flex items-center gap-3">
          <ShieldAlert className="h-8 w-8" />
          Super Admin: Manage User Roles
        </h1>
        <p className="text-muted-foreground mt-2">
          Promote or demote users to any role.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Roles</CardTitle>
          <CardDescription>
            Change the role of any user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead className="text-right">Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((u) => (
                <TableRow key={u.uid}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="capitalize">{u.role.replace('_', ' ')}</TableCell>
                  <TableCell className="text-right">
                    <UpdateRoleSelect userEmail={u.email} currentRole={u.role} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
