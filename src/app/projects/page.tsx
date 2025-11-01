
import { ProjectList } from "@/components/project-list";

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Our Projects</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Explore the innovative projects being developed by AURA Nexus members.
        </p>
      </div>
      <ProjectList />
    </div>
  );
}
