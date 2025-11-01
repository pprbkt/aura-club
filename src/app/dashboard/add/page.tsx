
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Library, Calendar, Newspaper, ArrowRight } from "lucide-react";
import Link from "next/link";

const contentTypes = [
    {
        icon: <FileText className="h-6 w-6 text-accent"/>,
        title: "Project",
        description: "Showcase a project with a detailed write-up, gallery, and objectives.",
        link: "/dashboard/add-project",
        enabled: true,
    },
    {
        icon: <Library className="h-6 w-6 text-accent"/>,
        title: "Resource",
        description: "Share a useful link, document, or file with the community.",
        link: "/dashboard/add-resource",
        enabled: true,
    },
    {
        icon: <Calendar className="h-6 w-6 text-accent"/>,
        title: "Opportunity",
        description: "Post an event, internship, or other opportunity for members.",
        link: "/dashboard/add-opportunity",
        enabled: true,
    },
    {
        icon: <Newspaper className="h-6 w-6 text-accent"/>,
        title: "Blog Post",
        description: "Write a blog article to share insights, stories, or updates.",
        link: "/dashboard/add-blog-post",
        enabled: true,
    }
]

export default function AddContentPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Add New Content</h1>
        <p className="text-muted-foreground mt-2">
            Select the type of content you would like to create and submit for review.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contentTypes.map((type) => (
            <Card key={type.title} className={`flex flex-col ${!type.enabled ? 'bg-muted/50' : ''}`}>
                <CardHeader className="flex-row items-center gap-4">
                    {type.icon}
                    <div>
                        <CardTitle className="font-headline">{type.title}</CardTitle>
                         { !type.enabled && <CardDescription>Coming Soon</CardDescription> }
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className={`text-sm ${!type.enabled ? 'text-muted-foreground' : 'text-foreground/80'}`}>
                        {type.description}
                    </p>
                </CardContent>
                <CardContent>
                     <Button asChild disabled={!type.enabled} className={!type.enabled ? 'bg-accent/50 cursor-not-allowed': ''}>
                        <Link href={type.link}>
                            Create {type.title}
                            <ArrowRight className="ml-2 h-4 w-4"/>
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
