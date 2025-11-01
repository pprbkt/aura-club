
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { ExternalOpportunity } from "@/hooks/use-auth";
import { format } from "date-fns";
import { Briefcase, Building, Calendar, ExternalLink, FileText, Users } from "lucide-react";

interface ExternalOpportunityDetailsDialogProps {
  opportunity: ExternalOpportunity;
  children: React.ReactNode;
}

export function ExternalOpportunityDetailsDialog({ opportunity, children }: ExternalOpportunityDetailsDialogProps) {
  
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <Badge variant="secondary" className="w-fit">{opportunity.externalType}</Badge>
          <DialogTitle className="font-headline text-2xl pt-2">{opportunity.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Building className="h-4 w-4 text-accent"/> <span className="font-medium text-foreground">{opportunity.organization}</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4 text-accent"/> <span className="font-medium text-foreground">Deadline: {format(new Date(opportunity.deadline), "PPP")}</span></div>
            </div>
            
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2"><FileText className="h-5 w-5 text-accent"/>Description</h4>
                    <p className="text-foreground/80 leading-relaxed text-sm">{opportunity.description}</p>
                </div>
                 <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2"><Users className="h-5 w-5 text-accent"/>Eligibility</h4>
                    <p className="text-foreground/80 leading-relaxed text-sm">{opportunity.eligibility}</p>
                </div>
                 <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2"><ExternalLink className="h-5 w-5 text-accent"/>Application Instructions</h4>
                    <p className="text-foreground/80 leading-relaxed text-sm whitespace-pre-wrap">{opportunity.applicationInstructions}</p>
                </div>
            </div>
        </div>
        
      </DialogContent>
    </Dialog>
  );
}
