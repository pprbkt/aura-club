"use client";

import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { ViewAlumnusDetailsDialog } from "@/components/view-alumnus-details-dialog";
import { ExternalLink } from 'lucide-react';

interface Alumnus {
  id: string;
  name: string;
  email: string;
  graduationYear: number;
  company: string;
  bio: string;
  photoURL: string;
  socialLinks?: { platform: string; url: string; }[];
}

const AlumniPage: FC = () => {
  const { user, alumniOpportunities } = useAuth();
  const [alumniData, setAlumniData] = useState<Alumnus[]>([]);
  const [selectedAlumnus, setSelectedAlumnus] = useState<Alumnus | null>(null);

  const handleViewMore = (alumnus: Alumnus) => {
    setSelectedAlumnus(alumnus);
  };

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const alumniCollection = collection(db, 'alumni');
        const alumniSnapshot = await getDocs(alumniCollection);
        const alumniList = alumniSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Alumnus);
        setAlumniData(alumniList);
      } catch (error) {
        console.error('Error fetching alumni data: ', error);
      }
    };

    fetchAlumni();
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Alumni Profiles Section - FIRST */}
        <div className="text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Our Alumni</h1>
          <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">
            Meet the talented individuals who have been a part of our journey.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl mx-auto">
          {alumniData.map((alumnus, index) => (
            <Card key={index} className="bg-card border-border/60">
              <CardHeader className="items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={alumnus.photoURL} alt={alumnus.name} />
                  <AvatarFallback>{alumnus.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="font-headline mt-4">{alumnus.name}</CardTitle>
                <p className="text-muted-foreground">Batch of {alumnus.graduationYear}</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex justify-center gap-4">
                  {alumnus.socialLinks && Array.isArray(alumnus.socialLinks) && alumnus.socialLinks.map((link) => (
                    link.platform === "LinkedIn" && (
                      <Button asChild key={link.url} size="sm">
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          LinkedIn
                        </a>
                      </Button>
                    )
                  ))}
                  <Button variant="secondary" onClick={() => handleViewMore(alumnus)} size="sm">
                    View More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alumni Opportunities Section - SECOND */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Alumni Opportunities</h2>
            <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">
              Opportunities shared by our alumni network
            </p>
          </div>

          {alumniOpportunities.length > 0 ? (
            <div className="flex flex-col gap-6">
              {alumniOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="bg-card border-border/60 hover:border-border transition-colors w-full">
                  <div className="flex items-center justify-between gap-6 p-6">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="font-headline text-2xl mb-2">{opportunity.title}</CardTitle>
                      <CardDescription className="text-base">
                        {opportunity.description}
                      </CardDescription>
                    </div>
                    <div className="flex-shrink-0">
                      <Button asChild size="lg">
                        <a href={opportunity.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Opportunity
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No opportunities available at the moment.</p>
            </div>
          )}
        </div>
      </div>

      <ViewAlumnusDetailsDialog
        alumnus={selectedAlumnus}
        onClose={() => setSelectedAlumnus(null)}
      />
    </>
  );
};

export default AlumniPage;
