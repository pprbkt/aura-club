"use client";

import { useState } from 'react';
import { useAuth, type UserRole } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const allRoles: UserRole[] = ['user', 'member', 'admin', 'super_admin'];

interface UpdateRoleSelectProps {
  userEmail: string;
  currentRole: UserRole;
}

export function UpdateRoleSelect({ userEmail, currentRole }: UpdateRoleSelectProps) {
  const { user: currentUser, updateUserRole, users } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const canUpdateRole = (newRole: UserRole) => {
    if (currentUser?.role !== 'super_admin') {
      return false;
    }
    if (currentRole === 'super_admin' && newRole !== 'super_admin') {
      const superAdminCount = users.filter(u => u.role === 'super_admin').length;
      if (superAdminCount <= 1) {
        toast({
          variant: 'destructive',
          title: 'Cannot demote the only super admin',
          description: 'There must be at least one super admin.',
        });
        return false;
      }
    }
    return true;
  };

  const allowedRoles = currentUser?.role === 'super_admin'
    ? allRoles
    : ['user', 'member'];

  const handleRoleChange = async (newRole: UserRole) => {
    if (!canUpdateRole(newRole)) {
      return;
    }
    setIsUpdating(true);
    try {
      await updateUserRole(userEmail, newRole);
      toast({
        title: "Role Updated",
        description: `The user's role has been changed to ${newRole}.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Could not update the user role.',
      });
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <Select
      value={currentRole}
      onValueChange={(value) => handleRoleChange(value as UserRole)}
      disabled={isUpdating || currentUser?.email === userEmail}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        {allowedRoles.map((role) => (
          <SelectItem key={role} value={role} className="capitalize">
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}