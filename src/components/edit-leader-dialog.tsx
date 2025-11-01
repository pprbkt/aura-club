
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import type { LeadershipMember } from "@/hooks/use-auth";
import { useState } from "react";
import { Switch } from "./ui/switch";

const leaderSchema = z.object({
  name: z.string().min(2, "Name is required."),
  role: z.string().min(2, "Role is required."),
  bio: z.string().min(10, "Bio must be at least 10 characters.").max(200, "Bio cannot exceed 200 characters."),
  imageUrl: z.string().url("A valid image URL is required."),
  order: z.coerce.number().min(0, "Order must be a non-negative number."),
  isVisible: z.boolean().default(true),
});

type LeaderFormValues = z.infer<typeof leaderSchema>;

interface EditLeaderDialogProps {
  children: React.ReactNode;
  leader?: LeadershipMember;
}

export function EditLeaderDialog({ children, leader }: EditLeaderDialogProps) {
  const [open, setOpen] = useState(false);
  const { addLeader, updateLeader } = useAuth();
  const { toast } = useToast();
  const isEditing = !!leader;

  const form = useForm<LeaderFormValues>({
    resolver: zodResolver(leaderSchema),
    defaultValues: {
      name: leader?.name || "",
      role: leader?.role || "",
      bio: leader?.bio || "",
      imageUrl: leader?.imageUrl || "",
      order: leader?.order ?? 0,
      isVisible: leader?.isVisible ?? true,
    },
  });

  async function onSubmit(data: LeaderFormValues) {
    try {
      if (isEditing && leader) {
        await updateLeader({ id: leader.id, ...data });
        toast({ title: "Leader Updated", description: "The leadership member's details have been saved." });
      } else {
        await addLeader(data);
        toast({ title: "Leader Added", description: "The new leader has been added to the team." });
      }
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Failed to save leader", error);
      toast({
        variant: "destructive",
        title: "Operation Failed",
        description: "Could not save leadership member details. Please try again.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">{isEditing ? "Edit Leader" : "Add New Leader"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the details for this leadership member." : "Add a new member to the leadership team."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Alex Thompson" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role / Designation</FormLabel>
                  <FormControl><Input placeholder="e.g., President" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Bio</FormLabel>
                  <FormControl><Textarea placeholder="A short bio highlighting their contributions or vision." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl><Input placeholder="https://example.com/photo.png" {...field} /></FormControl>
                  <FormDescription>A direct link to a square (1:1 aspect ratio) photo.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormDescription>Determines the order on the page (0 first, 1 second, etc.).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="isVisible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Visible</FormLabel>
                    <FormDescription>
                      Show this member on the public "About" page.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
