"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export function ProjectList() {
    const { projects } = useAuth();
    const approvedProjects = projects.filter(p => p.status === 'approved');
  
    if (approvedProjects.length > 0) {
        return (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {approvedProjects.map((project) => (
                <Card key={project.id} className="bg-card border-border/60 overflow-hidden group">
                  <Link href={`/projects/${project.id}`} className="block">
                    <div className="overflow-hidden rounded-t-lg">
                      <Image
                        src={project.thumbnailImage}
                        data-ai-hint={project.title.split(" ").slice(0,2).join(" ")}
                        alt={project.title}
                        width={600}
                        height={400}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="font-headline group-hover:text-accent transition-colors">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm line-clamp-3">{project.excerpt}</p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
        )
    }

    return (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <p className="text-lg font-medium text-muted-foreground">No projects have been added yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">Check back soon or, if you're a member, add a project from your dashboard!</p>
        </div>
    );
}
