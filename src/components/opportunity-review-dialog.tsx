
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
import { Check, X } from "lucide-react";
import type { Opportunity } from "@/hooks/use-auth";
import { RejectionReasonDialog } from "./rejection-reason-dialog";
import { format } from "date-fns";
import Image from "next/image";

interface OpportunityReviewDialogProps {
  opportunity: Opportunity;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  children: React.ReactNode;
}

export function OpportunityReviewDialog({ opportunity, onApprove, onReject, children }: OpportunityReviewDialogProps) {
  
  const handleApprove = () => {
    onApprove(opportunity.id);
  };

  const handleConfirmReject = (reason: string) => {
    onReject(opportunity.id, reason);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
             <Badge variant="default" className="w-fit capitalize">{opportunity.category}</Badge>
             {opportunity.category === 'event' && <Badge variant="secondary" className="w-fit">{opportunity.eventType}</Badge>}
             {opportunity.category === 'external' && <Badge variant="secondary" className="w-fit">{opportunity.externalType}</Badge>}
          </div>
          <DialogTitle className="font-headline text-2xl pt-2">{opportunity.title}</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Submitted by: {opportunity.authorName} ({opportunity.authorEmail})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {opportunity.category === 'event' && (
            <>
              {opportunity.host && <p><strong>Host:</strong> {opportunity.host}</p>}
              <p><strong>Date:</strong> {format(new Date(opportunity.date), "PPP")} at {opportunity.time}</p>
              <p><strong>Location/Link:</strong> {opportunity.location}</p>
              <p><strong>Description:</strong> {opportunity.description}</p>
              {opportunity.image && <div className="pt-2"><p className="font-semibold">Image:</p><Image src={opportunity.image} alt={opportunity.title} width={400} height={200} className="rounded-md border mt-2"/></div>}
            </>
          )}
           {opportunity.category === 'session' && (
            <>
              <p><strong>Time:</strong> {opportunity.time}</p>
              <p><strong>Venue:</strong> {opportunity.venue}</p>
              <p><strong>Overview:</strong> {opportunity.description}</p>
            </>
          )}
           {opportunity.category === 'external' && (
            <>
              <p><strong>Organization:</strong> {opportunity.organization}</p>
              <p><strong>Deadline:</strong> {format(new Date(opportunity.deadline), "PPP")}</p>
              <p><strong>Description:</strong> {opportunity.description}</p>
              <p><strong>Eligibility:</strong> {opportunity.eligibility}</p>
              <p><strong>Instructions:</strong> {opportunity.applicationInstructions}</p>
            </>
          )}
        </div>
        
        <DialogFooter className="pt-4">
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
