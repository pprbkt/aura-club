
"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import type { EventOpportunity, EventType } from "@/hooks/use-auth";
import { format } from "date-fns";
import { EventDetailsDialog } from "@/components/event-details-dialog";

const EventListItem = ({ event }: { event: EventOpportunity }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
        <div>
            <Badge variant="secondary" className="mb-2 w-fit">{event.eventType}</Badge>
            <h3 className="font-headline text-lg font-semibold">{event.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
                {format(new Date(event.date), "PPP")}
            </p>
        </div>
        <EventDetailsDialog event={event}>
            <Button variant="outline" className="w-full sm:w-auto flex-shrink-0">View Details</Button>
        </EventDetailsDialog>
    </div>
);

export default function EventsPage() {
  const { opportunities } = useAuth();
  const [typeFilter, setTypeFilter] = useState<EventType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"upcoming" | "past" | "all">("all");

  const events = useMemo(() => {
    let filtered = opportunities
      .filter(o => o.status === 'approved' && o.category === 'event') as EventOpportunity[];
    
    if (typeFilter !== "all") {
      filtered = filtered.filter(e => e.eventType === typeFilter);
    }
    
    if (statusFilter !== "all") {
      const now = new Date();
      now.setHours(0,0,0,0); // Start of today
      filtered = filtered.filter(e => {
          const eventDate = new Date(e.date);
          return statusFilter === 'upcoming' ? eventDate >= now : eventDate < now;
      });
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [opportunities, typeFilter, statusFilter]);

  return (
    <div>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Talk">Talks</SelectItem>
                    <SelectItem value="Competition">Competitions</SelectItem>
                    <SelectItem value="Workshop">Workshops</SelectItem>
                </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {events.length > 0 ? (
            <div className="divide-y divide-border rounded-lg border bg-card">
                {events.map((event) => (
                    <div key={event.id} className="px-4">
                       <EventListItem event={event} />
                    </div>
                ))}
            </div>
        ) : (
             <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                <p className="text-lg font-medium text-muted-foreground">No events match the current filters.</p>
                <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters or check back later!</p>
            </div>
        )}
    </div>
  );
}
