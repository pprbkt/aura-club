
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function FeaturedProjects() {
    const { projects } = useAuth();
    const featuredProjects = projects.filter(p => p.status === 'approved').slice(0, 3);
  
    return (
        <section className="py-16 md:py-24 relative bg-background">
            <div className="container mx-auto px-4">
            <div className="text-center">
                <h2 className="font-headline text-3xl md:text-4xl font-bold">Featured Projects</h2>
                <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">
                Check out some of the innovative work our members are leading.
                </p>
            </div>
            {featuredProjects.length > 0 ? (
                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.map((project) => (
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
            ) : (
                <div className="text-center py-8 mt-8 border-2 border-dashed border-border rounded-lg bg-card/80 backdrop-blur-sm">
                <p className="text-muted-foreground">No featured projects at the moment.</p>
                <p className="text-sm text-muted-foreground">Members can add projects from their dashboard.</p>
                </div>
            )}
            <div className="mt-12 text-center">
                <Button asChild variant="outline">
                <Link href="/projects">View All Projects</Link>
                </Button>
            </div>
            </div>
      </section>
    )
}
