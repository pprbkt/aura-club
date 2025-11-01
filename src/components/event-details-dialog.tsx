
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
import type { EventOpportunity } from "@/hooks/use-auth";
import { format } from "date-fns";
import Image from "next/image";
import { Building, Calendar, Clock, MapPin } from "lucide-react";

interface EventDetailsDialogProps {
  event: EventOpportunity;
  children: React.ReactNode;
}

export function EventDetailsDialog({ event, children }: EventDetailsDialogProps) {
  
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <Badge variant="secondary" className="w-fit">{event.eventType}</Badge>
          <DialogTitle className="font-headline text-2xl pt-2">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
            {event.image && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                    <Image src={event.image} alt={event.title} fill objectFit="cover" data-ai-hint="event banner"/>
                </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4 text-accent"/> <span className="font-medium text-foreground">{format(new Date(event.date), "PPP")}</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4 text-accent"/> <span className="font-medium text-foreground">{event.time}</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 text-accent"/> <span className="font-medium text-foreground">{event.location}</span></div>
                {event.host && <div className="flex items-center gap-2 text-muted-foreground"><Building className="h-4 w-4 text-accent"/> <span className="font-medium text-foreground">Hosted by {event.host}</span></div>}
            </div>

            <p className="text-foreground/80 leading-relaxed">{event.description}</p>
        </div>
        
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
