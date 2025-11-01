
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import type { SubmissionStatus } from "@/hooks/use-auth";

const statusColors: { [key in SubmissionStatus]: "default" | "secondary" | "destructive" | "outline" } = {
  approved: "secondary",
  pending: "outline",
  rejected: "destructive",
};

export default function DeleteContentPage() {
    const { projects, resources, opportunities, blogPosts, deleteProject, deleteResource, deleteOpportunity, deleteBlogPost } = useAuth();
    const { toast } = useToast();

    const handleDeleteProject = (id: string) => {
        deleteProject(id);
        toast({ title: "Project Deleted", description: "The project has been permanently removed." });
    };

    const handleDeleteResource = (id: string) => {
        deleteResource(id);
        toast({ title: "Resource Deleted", description: "The resource has been permanently removed." });
    };

    const handleDeleteOpportunity = (id: string) => {
        deleteOpportunity(id);
        toast({ title: "Opportunity Deleted", description: "The opportunity has been permanently removed." });
    };

    const handleDeleteBlogPost = (id: string) => {
        deleteBlogPost(id);
        toast({ title: "Blog Post Deleted", description: "The post has been permanently removed." });
    };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Delete Content</h1>
        <p className="text-muted-foreground mt-2">
            Permanently remove approved content from the website. This action cannot be undone.
        </p>
      </div>
        <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                <TabsTrigger value="blog">Blog</TabsTrigger>
            </TabsList>
            <TabsContent value="projects">
                <Card>
                    <CardHeader>
                        <CardTitle>All Projects ({projects.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {projects.length > 0 ? (
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead className="hidden md:table-cell">Author</TableHead>
                                <TableHead className="hidden sm:table-cell">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {projects.map((project) => (
                                <TableRow key={project.id}>
                                <TableCell className="font-medium">{project.title}</TableCell>
                                <TableCell className="hidden md:table-cell">{project.authorName}</TableCell>
                                <TableCell className="hidden sm:table-cell"><Badge variant={statusColors[project.status]}>{project.status}</Badge></TableCell>
                                <TableCell className="text-right">
                                    {project.status === 'approved' && (
                                        <DeleteConfirmationDialog
                                            onConfirm={() => handleDeleteProject(project.id)}
                                            title="Delete Project?"
                                            description={`Are you sure you want to delete the project "${project.title}"? This action cannot be undone.`}
                                        >
                                            <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-1"/>Delete</Button>
                                        </DeleteConfirmationDialog>
                                    )}
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        ) : (
                        <p className="text-sm text-muted-foreground">No projects found.</p>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="resources">
                <Card>
                    <CardHeader>
                        <CardTitle>All Resources ({resources.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                         {resources.length > 0 ? (
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead className="hidden md:table-cell">Category</TableHead>
                                <TableHead className="hidden sm:table-cell">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {resources.map((resource) => (
                                <TableRow key={resource.id}>
                                <TableCell className="font-medium">{resource.title}</TableCell>
                                <TableCell className="hidden md:table-cell">{resource.category}</TableCell>
                                <TableCell className="hidden sm:table-cell"><Badge variant={statusColors[resource.status]}>{resource.status}</Badge></TableCell>
                                <TableCell className="text-right">
                                    {resource.status === 'approved' && (
                                        <DeleteConfirmationDialog
                                            onConfirm={() => handleDeleteResource(resource.id)}
                                            title="Delete Resource?"
                                            description={`Are you sure you want to delete the resource "${resource.title}"? This action cannot be undone.`}
                                        >
                                            <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-1"/>Delete</Button>
                                        </DeleteConfirmationDialog>
                                    )}
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        ) : (
                        <p className="text-sm text-muted-foreground">No resources found.</p>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="opportunities">
                <Card>
                    <CardHeader>
                        <CardTitle>All Opportunities ({opportunities.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {opportunities.length > 0 ? (
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead className="hidden md:table-cell">Category</TableHead>
                                <TableHead className="hidden sm:table-cell">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {opportunities.map((opportunity) => (
                                <TableRow key={opportunity.id}>
                                <TableCell className="font-medium">{opportunity.title}</TableCell>
                                <TableCell className="hidden md:table-cell">{opportunity.category}</TableCell>
                                <TableCell className="hidden sm:table-cell"><Badge variant={statusColors[opportunity.status]}>{opportunity.status}</Badge></TableCell>
                                <TableCell className="text-right">
                                    {opportunity.status === 'approved' && (
                                        <DeleteConfirmationDialog
                                            onConfirm={() => handleDeleteOpportunity(opportunity.id)}
                                            title="Delete Opportunity?"
                                            description={`Are you sure you want to delete the opportunity "${opportunity.title}"? This action cannot be undone.`}
                                        >
                                            <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-1"/>Delete</Button>
                                        </DeleteConfirmationDialog>
                                    )}
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        ) : (
                        <p className="text-sm text-muted-foreground">No opportunities found.</p>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="blog">
                <Card>
                    <CardHeader>
                        <CardTitle>All Blog Posts ({blogPosts.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {blogPosts.length > 0 ? (
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead className="hidden md:table-cell">Author</TableHead>
                                <TableHead className="hidden sm:table-cell">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {blogPosts.map((post) => (
                                <TableRow key={post.id}>
                                <TableCell className="font-medium">{post.title}</TableCell>
                                <TableCell className="hidden md:table-cell">{post.authorName}</TableCell>
                                <TableCell className="hidden sm:table-cell"><Badge variant={statusColors[post.status]}>{post.status}</Badge></TableCell>
                                <TableCell className="text-right">
                                    {post.status === 'approved' && (
                                        <DeleteConfirmationDialog
                                            onConfirm={() => handleDeleteBlogPost(post.id)}
                                            title="Delete Blog Post?"
                                            description={`Are you sure you want to delete the post "${post.title}"? This action cannot be undone.`}
                                        >
                                            <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-1"/>Delete</Button>
                                        </DeleteConfirmationDialog>
                                    )}
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        ) : (
                        <p className="text-sm text-muted-foreground">No blog posts found.</p>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
