
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface RejectionReasonDialogProps {
  children: React.ReactNode;
  onConfirm: (reason: string) => void;
}

export function RejectionReasonDialog({ children, onConfirm }: RejectionReasonDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setOpen(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reason for Rejection</DialogTitle>
          <DialogDescription>
            Please provide a brief reason for rejecting this submission. This will be shown to the member.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <Label htmlFor="rejection-reason" className="sr-only">Rejection Reason</Label>
            <Textarea 
                id="rejection-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., The project description is incomplete."
                className="min-h-[100px]"
            />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={handleConfirm} disabled={!reason.trim()}>
                Confirm Rejection
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
