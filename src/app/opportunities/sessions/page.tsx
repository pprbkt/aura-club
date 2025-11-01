
"use client";

import { useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import type { SessionOpportunity } from "@/hooks/use-auth";
import { Users, Clock, MapPin } from "lucide-react";

const SessionItem = ({ session }: { session: SessionOpportunity }) => (
    <div className="px-4 py-6">
        <h3 className="font-headline text-xl flex items-center gap-3"><Users className="text-accent"/>{session.title}</h3>
        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-3 text-muted-foreground">
            <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-accent"/> {session.venue}</div>
            <div className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-accent"/> {session.time}</div>
        </div>
        <p className="text-muted-foreground mt-4">{session.description}</p>
    </div>
);

export default function SessionsPage() {
    const { opportunities } = useAuth();

    const sessions = useMemo(() => {
        return opportunities
            .filter(o => o.status === 'approved' && o.category === 'session') as SessionOpportunity[];
    }, [opportunities]);

    return (
        <div className="divide-y divide-border rounded-lg border bg-card">
            {sessions.length > 0 ? (
                sessions.map(session => <SessionItem key={session.id} session={session} />)
            ) : (
                <div className="text-center py-12">
                    <p className="text-lg font-medium text-muted-foreground">No club sessions have been posted yet.</p>
                    <p className="mt-2 text-sm text-muted-foreground">Check back soon for weekly session details!</p>
                </div>
            )}
        </div>
    );
}
