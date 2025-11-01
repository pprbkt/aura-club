
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper } from "lucide-react";
import { useRef } from "react";
import { MarkdownToolbar } from "@/components/markdown-toolbar";

const blogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters.").max(200, "Excerpt cannot exceed 200 characters."),
  content: z.string().min(100, "Blog content must be at least 100 characters."),
  tags: z.string().optional(),
  imageUrl: z.string().url("Please enter a valid image URL.").optional().or(z.literal('')),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

export default function AddBlogPostPage() {
  const { addBlogPost } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      tags: "",
      imageUrl: "",
    },
  });

  async function onSubmit(data: BlogPostFormValues) {
    try {
      await addBlogPost(data);
      toast({
        title: "Blog Post Submitted!",
        description: "Your post is now pending review by an admin.",
      });
      router.push('/dashboard/add');
    } catch (error: any) {
      console.error("Submission Failed:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "Could not submit your blog post. Please try again.",
      });
    }
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Newspaper />
            Create a New Blog Post
        </CardTitle>
        <CardDescription>Share your insights, project updates, or stories with the community.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Title</FormLabel>
                  <FormControl><Input placeholder="e.g., A Deep Dive into Solid Rocket Fuels" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl><Textarea placeholder="A short, catchy summary that appears on the blog listing page." {...field} /></FormControl>
                  <FormDescription>Maximum 200 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                   <MarkdownToolbar textareaRef={contentRef} />
                  <FormControl>
                    <Textarea 
                      className="min-h-64 mt-2" 
                      placeholder="Write your full blog post here. Use the toolbar above to format your text." 
                      {...field}
                      ref={contentRef}
                    />
                  </FormControl>
                  <FormDescription>Use Markdown for headings, lists, bold/italic text, and links.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Header Image URL (Optional)</FormLabel>
                  <FormControl><Input placeholder="https://example.com/your-image.png" {...field} /></FormControl>
                  <FormDescription>Provide a direct link to an image for the blog post header.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (Optional)</FormLabel>
                  <FormControl><Input placeholder="Workshop, CFD, Personal Experience" {...field} /></FormControl>
                  <FormDescription>Comma-separated list of tags.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={() => router.push('/dashboard/add')}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : "Submit for Review"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
