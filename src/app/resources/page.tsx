
"use client";

import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import type { Resource } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

const ResourceListItem = ({ title, description, link, image, category }: Resource) => (
  <Card className="bg-card border-border/60 overflow-hidden">
    <div className="flex flex-col sm:flex-row">
      {image && (
        <div className="sm:w-1/3">
          <Image
            src={image}
            alt={title}
            data-ai-hint={`${category} icon`}
            width={400}
            height={225}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className={`flex flex-col ${image ? 'sm:w-2/3' : 'w-full'}`}>
        <CardHeader>
            <div className="flex justify-between items-start gap-4">
                <div className="flex-grow">
                <CardTitle className="font-headline text-lg">{title}</CardTitle>
                </div>
                <Button variant="secondary" asChild className="flex-shrink-0">
                <a href={link} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    Get
                </a>
                </Button>
            </div>
        </CardHeader>
        <CardContent className="flex-grow">
             <CardDescription>{description}</CardDescription>
        </CardContent>
      </div>
    </div>
  </Card>
);

const ResourceCategoryContent = ({ resources }: { resources: Resource[] }) => (
  <div className="space-y-4">
    {resources.length > 0 ? (
      resources.map((item) => <ResourceListItem key={item.id} {...item} />)
    ) : (
      <p className="text-muted-foreground text-sm text-center py-8">No resources in this category yet.</p>
    )}
  </div>
);

const LoadingSkeleton = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <Card key={i} className="flex flex-col sm:flex-row bg-card border-border/60 overflow-hidden">
                <div className="sm:w-1/3">
                    <Skeleton className="h-full w-full aspect-video" />
                </div>
                <div className="sm:w-2/3 p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </Card>
        ))}
    </div>
)

export default function ResourcesPage() {
  const { resources, loading } = useAuth();
  const approvedResources = resources.filter(r => r.status === 'approved');

  const categories = ["Plug-ins", "Research Papers", "3D Designs", "Blueprints"];
  const categorizedResources: { [key: string]: Resource[] } = {
    "Plug-ins": approvedResources.filter(r => r.category === "Plug-ins"),
    "Research Papers": approvedResources.filter(r => r.category === "Research Papers"),
    "3D Designs": approvedResources.filter(r => r.category === "3D Designs"),
    "Blueprints": approvedResources.filter(r => r.category === "Blueprints"),
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Resource Hub</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          A curated collection of tools, papers, and assets for aerospace enthusiasts.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8 bg-primary/20">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map(cat => <TabsTrigger key={cat} value={cat.replace(/\s+/g, '-').toLowerCase()}>{cat}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="all">
            {loading ? (
                <LoadingSkeleton />
            ) : approvedResources.length > 0 ? (
                <div className="space-y-4">
                    {approvedResources.map((item) => <ResourceListItem key={item.id} {...item} />)}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                    <p className="text-lg font-medium text-muted-foreground">No resources have been added yet.</p>
                    <p className="mt-2 text-sm text-muted-foreground">Check back soon or, if you're a member, add a resource from your dashboard!</p>
                </div>
            )}
        </TabsContent>
        <TabsContent value="plug-ins">
            {loading ? <LoadingSkeleton /> : <ResourceCategoryContent resources={categorizedResources["Plug-ins"]} />}
        </TabsContent>
        <TabsContent value="research-papers">
            {loading ? <LoadingSkeleton /> : <ResourceCategoryContent resources={categorizedResources["Research Papers"]} />}
        </TabsContent>
        <TabsContent value="3d-designs">
            {loading ? <LoadingSkeleton /> : <ResourceCategoryContent resources={categorizedResources["3D Designs"]} />}
        </TabsContent>
        <TabsContent value="blueprints">
            {loading ? <LoadingSkeleton /> : <ResourceCategoryContent resources={categorizedResources["Blueprints"]} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
