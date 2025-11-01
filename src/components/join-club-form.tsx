
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  reason: z.string().min(20, "Please tell us a bit more about why you want to join (at least 20 characters)."),
});

type FormValues = z.infer<typeof formSchema>;

export function JoinClubForm() {
  const { user, requestMembership } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  });

  async function onSubmit(data: FormValues) {
    if (!user || !user.email) return;

    setIsSubmitting(true);
    try {
      await requestMembership(user.email, data.reason);
      toast({
        title: "Application Submitted!",
        description: "Thank you! Your application is now pending review by an admin.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "Could not submit your application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why do you want to join the club?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your interests in aerospace, projects you've worked on, or what you hope to learn..."
                  className="resize-y min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This will help us understand how you can contribute to and benefit from the club.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </Form>
  );
}
