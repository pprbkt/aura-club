
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
import { useEffect } from "react";

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


  const manageableUsers = users.filter(u => u.email !== user.email);

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
              {manageableUsers.map((u) => (
                <TableRow key={u.uid}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="capitalize">{u.role}</TableCell>
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
