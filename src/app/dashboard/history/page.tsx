
"use client";

import { useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import type { Project, Resource, SubmissionStatus, Opportunity } from "@/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Library, History as HistoryIcon, MessageSquareWarning, Calendar } from "lucide-react";

type Submission = (Project | Resource | Opportunity) & { submissionType: 'Project' | 'Resource' | 'Opportunity' };

const SubmissionItem = ({ submission }: { submission: Submission }) => {
  const statusColors: { [key in SubmissionStatus]: "default" | "secondary" | "destructive" | "outline" } = {
    approved: "secondary",
    pending: "outline",
    rejected: "destructive",
  };

  const statusText: { [key in SubmissionStatus]: string } = {
      approved: "Approved",
      pending: "Pending",
      rejected: "Rejected",
  };

  const isRejected = submission.status === 'rejected' && submission.rejectionReason;

  const getIcon = () => {
    switch (submission.submissionType) {
        case 'Project': return <FileText className="h-5 w-5 text-muted-foreground" />;
        case 'Resource': return <Library className="h-5 w-5 text-muted-foreground" />;
        case 'Opportunity': return <Calendar className="h-5 w-5 text-muted-foreground" />;
        default: return null;
    }
  }

  return (
    <div className={`rounded-lg border border-border/40 overflow-hidden ${isRejected ? 'bg-destructive/5' : 'bg-primary/10'}`}>
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
                {getIcon()}
                <div>
                    <p className="font-semibold">{submission.title}</p>
                    <p className="text-sm text-muted-foreground">{submission.submissionType}</p>
                </div>
            </div>
            <Badge variant={statusColors[submission.status]}>{statusText[submission.status]}</Badge>
        </div>
        {isRejected && (
            <div className="p-4 bg-destructive/10 border-t border-destructive/20">
                <div className="flex items-start gap-3">
                    <MessageSquareWarning className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-destructive">Rejection Reason</h4>
                        <p className="text-sm text-destructive/90 mt-1">{submission.rejectionReason}</p>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default function HistoryPage() {
    const { user, projects, resources, opportunities } = useAuth();
    
    const mySubmissions = useMemo(() => {
        if (!user?.email) return [];
        
        const myProjects = projects
            .filter(p => p.authorEmail === user.email)
            .map(p => ({ ...p, submissionType: 'Project' as const }));

        const myResources = resources
            .filter(r => r.authorEmail === user.email)
            .map(r => ({ ...r, submissionType: 'Resource' as const }));

        const myOpportunities = opportunities
            .filter(o => o.authorEmail === user.email)
            .map(o => ({...o, submissionType: 'Opportunity' as const}));

        return [...myProjects, ...myResources, ...myOpportunities]
            .sort((a, b) => {
                const dateA = a.createdAt?.toMillis() || 0;
                const dateB = b.createdAt?.toMillis() || 0;
                return dateB - dateA;
            });

    }, [projects, resources, opportunities, user?.email]);

    return (
        <div>
            <h1 className="font-headline text-3xl font-bold mb-8 flex items-center gap-3">
                <HistoryIcon className="h-8 w-8"/>
                My Submissions
            </h1>
            <Card>
                <CardHeader>
                    <CardTitle>Submission History</CardTitle>
                    <CardDescription>Track the approval status of your submitted content.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {mySubmissions.length > 0 ? (
                        mySubmissions.map(sub => <SubmissionItem key={`${sub.submissionType}-${sub.id}`} submission={sub} />)
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">You haven't submitted any content yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
