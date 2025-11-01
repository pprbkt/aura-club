
"use client";

import { useState } from "react";
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
import { Check, X, Link as LinkIcon, Tag } from "lucide-react";
import type { Resource } from "@/hooks/use-auth";
import { RejectionReasonDialog } from "./rejection-reason-dialog";
import Image from "next/image";


interface ResourceReviewDialogProps {
  resource: Resource;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  children: React.ReactNode;
}

export function ResourceReviewDialog({ resource, onApprove, onReject, children }: ResourceReviewDialogProps) {
  
  const handleApprove = () => {
    onApprove(resource.id);
  };

  const handleConfirmReject = (reason: string) => {
    onReject(resource.id, reason);
  };
  
  // Ensure tags are always an array before mapping
  const tagsArray = Array.isArray(resource.tags)
    ? resource.tags
    : typeof resource.tags === 'string' && resource.tags.length > 0
    ? resource.tags.split(',').map(t => t.trim())
    : [];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <Badge variant="default" className="w-fit mb-2">{resource.category}</Badge>
          <DialogTitle className="font-headline text-2xl">{resource.title}</DialogTitle>
          <DialogDescription>{resource.description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
            {resource.image && (
                 <div>
                    <h3 className="font-semibold mb-2">Image</h3>
                    <Image 
                        src={resource.image} 
                        alt={resource.title} 
                        width={400} 
                        height={225} 
                        className="rounded-lg border"
                        data-ai-hint="resource icon"
                    />
                </div>
            )}
            <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><LinkIcon/> Link</h3>
                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline break-all">
                    {resource.link}
                </a>
            </div>

            {tagsArray.length > 0 && (
                 <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Tag/> Tags</h3>
                    <div className="flex flex-wrap gap-2">
                         {tagsArray.map((tag, i) => <Badge key={i} variant="secondary">{tag}</Badge>)}
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
