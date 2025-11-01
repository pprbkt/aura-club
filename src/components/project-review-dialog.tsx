
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
import { ExternalLink, Users, Target, FlaskConical, CheckCircle, Check, X } from "lucide-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { Project } from "@/hooks/use-auth";
import { RejectionReasonDialog } from "./rejection-reason-dialog";
import React from "react";

interface ProjectReviewDialogProps {
  project: Project;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  children: React.ReactNode;
}

export function ProjectReviewDialog({ project, onApprove, onReject, children }: ProjectReviewDialogProps) {
  const [isRejecting, setIsRejecting] = useState(false);
  
  const handleApprove = () => {
    onApprove(project.id);
  };

  const handleConfirmReject = (reason: string) => {
    onReject(project.id, reason);
    setIsRejecting(false);
  };
  
  const renderDescription = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
        <p key={i}>
            {line}
        </p>
    ));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{project.title}</DialogTitle>
          <DialogDescription>{project.excerpt}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-8 py-4">
            <Image 
                src={project.thumbnailImage} 
                alt={project.title}
                data-ai-hint={project.title.split(" ").slice(0,2).join(" ")}
                width={1200}
                height={600}
                className="w-full rounded-lg shadow-lg"
            />
            
            <div>
                <h3 className="font-headline text-lg font-semibold mb-2">Full Description</h3>
                <div className="prose prose-invert max-w-none text-foreground/90 space-y-4">
                  {renderDescription(project.description)}
                </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-headline text-lg font-semibold mb-2 flex items-center gap-2"><Target /> Objectives</h3>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        {project.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                    </ul>
                </div>
                 <div>
                     <h3 className="font-headline text-lg font-semibold mb-2 flex items-center gap-2"><Users /> Team Members</h3>
                    <div className="flex flex-wrap gap-2">
                         {project.teamMembers.map((member, i) => <Badge key={i} variant="secondary">{member}</Badge>)}
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-headline text-lg font-semibold mb-2 flex items-center gap-2"><FlaskConical/> Methodology</h3>
                <p className="text-muted-foreground">{project.methodology}</p>
            </div>
             <div>
                <h3 className="font-headline text-lg font-semibold mb-2 flex items-center gap-2"><CheckCircle/> Outcomes</h3>
                <p className="text-muted-foreground">{project.outcomes}</p>
            </div>

             {project.galleryImages && project.galleryImages.length > 0 && (
                <div>
                    <h3 className="font-headline text-lg font-semibold mb-2">Gallery</h3>
                    <Carousel className="w-full max-w-2xl mx-auto">
                        <CarouselContent>
                            {project.galleryImages.map((img, i) => (
                                <CarouselItem key={i}>
                                    <Image src={img} alt={`${project.title} gallery image ${i+1}`} width={1000} height={700} className="w-full rounded-md" data-ai-hint="project gallery" />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            )}
             
            {project.externalLinks && project.externalLinks.length > 0 && (
                 <div>
                    <h3 className="font-headline text-lg font-semibold mb-2">Links & Resources</h3>
                    <div className="flex flex-col gap-3 max-w-md">
                        {project.externalLinks.map((link, i) => (
                            <Button asChild variant="outline" className="justify-start" key={i}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    {link.label}
                                </a>
                            </Button>
                        ))}
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
