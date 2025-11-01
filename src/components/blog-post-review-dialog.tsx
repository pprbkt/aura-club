
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Tag } from "lucide-react";
import type { BlogPost } from "@/hooks/use-auth";
import { RejectionReasonDialog } from "./rejection-reason-dialog";
import Image from "next/image";
import { format } from "date-fns";

// A simple component to render markdown
const MarkdownPreview = ({ content }: { content: string }) => {
    // Basic markdown to HTML conversion
    const html = content
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent underline">$1</a>')
        .replace(/^\* (.*$)/gim, '<ul class="list-disc pl-6"><li>$1</li></ul>') // Doesn't handle multi-line lists well
        .replace(/^\d+\. (.*$)/gim, '<ol class="list-decimal pl-6"><li>$1</li></ol>') // Doesn't handle multi-line lists well
        .replace(/\n/g, '<br />');

    return <div className="prose prose-invert max-w-none text-foreground/90 space-y-4" dangerouslySetInnerHTML={{ __html: html }} />;
};


interface BlogPostReviewDialogProps {
  post: BlogPost;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  children: React.ReactNode;
}

export function BlogPostReviewDialog({ post, onApprove, onReject, children }: BlogPostReviewDialogProps) {
  
  const handleApprove = () => {
    onApprove(post.id);
  };

  const handleConfirmReject = (reason: string) => {
    onReject(post.id, reason);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl">{post.title}</DialogTitle>
          <DialogDescription className="pt-2">
            By {post.authorName} on {format(post.createdAt.toDate(), "PPP")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
            {post.imageUrl && (
                 <Image 
                    src={post.imageUrl} 
                    alt={post.title}
                    data-ai-hint="blog header"
                    width={1200}
                    height={600}
                    className="w-full rounded-lg shadow-md aspect-video object-cover"
                />
            )}

            <div>
                <h3 className="font-semibold mb-2">Excerpt</h3>
                <p className="text-muted-foreground italic">"{post.excerpt}"</p>
            </div>
            
            <hr className="border-border/40" />

            <div>
                <h3 className="font-semibold mb-4">Content Preview</h3>
                <div className="p-4 border rounded-md bg-primary/5">
                    <MarkdownPreview content={post.content} />
                </div>
            </div>

            {post.tags && post.tags.length > 0 && (
                 <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Tag/> Tags</h3>
                    <div className="flex flex-wrap gap-2">
                         {post.tags.map((tag, i) => <Badge key={i} variant="secondary">{tag}</Badge>)}
                    </div>
                </div>
            )}
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>

          <RejectionReasonDialog onConfirm={handleConfirmReject}>
            <Button variant="destructive"><X className="h-4 w-4 mr-1" />Reject</Button>
          </RejectionReasonDialog>
          
          <DialogClose asChild>
            <Button onClick={handleApprove}><Check className="h-4 w-4 mr-1" />Approve</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
