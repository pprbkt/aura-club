"use client";

import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

// Placeholder data for alumni
const alumniData = [
  {
    name: 'John Doe',
    profilePicture: 'https://github.com/shadcn.png',
    email: 'john.doe@example.com',
    linkedin: 'https://www.linkedin.com/in/johndoe',
    batch: '2020',
  },
  {
    name: 'Jane Smith',
    profilePicture: 'https://github.com/shadcn.png',
    email: 'jane.smith@example.com',
    linkedin: 'https://www.linkedin.com/in/janesmith',
    batch: '2021',
  },
  // Add more alumni data here
];

// Placeholder data for opportunities
const opportunitiesData = [
  {
    title: 'Internship at SpaceX',
    description: 'An exciting internship opportunity for aspiring aerospace engineers.',
    link: '#',
  },
  {
    title: 'Alumni Meetup 2025',
    description: 'Join us for our annual alumni meetup.',
    link: '#',
  },
  // Add more opportunities here
];

const AlumniPage: FC = () => {
  const { user } = useAuth();
  const canViewOpportunities = user && (user.role === 'admin' || user.role === 'super_admin' || user.role === 'member');

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Our Alumni</h1>
        <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">
          Meet the talented individuals who have been a part of our journey.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {alumniData.map((alumnus, index) => (
          <Card key={index} className="bg-card border-border/60">
            <CardHeader className="items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={alumnus.profilePicture} alt={alumnus.name} />
                <AvatarFallback>{alumnus.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="font-headline mt-4">{alumnus.name}</CardTitle>
              <p className="text-muted-foreground">Batch of {alumnus.batch}</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex justify-center gap-4">
                <Button asChild variant="outline">
                  <a href={`mailto:${alumnus.email}`}>Email</a>
                </Button>
                <Button asChild>
                  <a href={alumnus.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {canViewOpportunities && (
        <div className="mt-24">
          <div className="text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Opportunities</h2>
            <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">
              Exclusive opportunities for our members and alumni.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {opportunitiesData.map((opportunity, index) => (
              <Card key={index} className="bg-card border-border/60">
                <CardHeader>
                  <CardTitle>{opportunity.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{opportunity.description}</p>
                  <Button asChild className="mt-4">
                    <a href={opportunity.link}>Learn More</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniPage;
