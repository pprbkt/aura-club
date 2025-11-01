
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Clock } from "lucide-react";
import { JoinClubForm } from "./join-club-form";

const joinFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type JoinFormValues = z.infer<typeof joinFormSchema>;

const GoogleIcon = () => (
  <svg className="h-4 w-4 mr-2" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.658-3.654-11.13-8.481l-6.571,4.819C9.656,39.663,16.318,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.021,35.591,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

export function JoinDialog({ children }: { children: React.ReactNode }) {
  const { user, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<JoinFormValues>({
    resolver: zodResolver(joinFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: JoinFormValues) {
    setIsSubmitting(true);
    try {
      await signUp(data.email, data.password, data.name);
      toast({
        title: "Account Created!",
        description: "You can now log in to access the portal.",
      });
      setOpen(false);
      router.push('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign-up failed",
        description: error.message || "Could not create your account. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Sign-up Successful!",
        description: "Redirecting to your dashboard...",
      });
      setOpen(false);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign-up Failed",
        description: "Could not sign up with Google. Please try again."
      });
    }
  }

  const renderContent = () => {
    if (!user) {
        // Logged-out user: Show sign-up form
        return (
            <>
                <DialogHeader className="text-center">
                    <DialogTitle className="font-headline text-3xl">Create an Account</DialogTitle>
                    <DialogDescription>
                        Already have an account?{" "}
                        <Button variant="link" asChild className="p-0 h-auto">
                            <Link href="/login" onClick={() => setOpen(false)}>
                                Sign in
                            </Link>
                        </Button>
                    </DialogDescription>
                </DialogHeader>
                <div className="px-6 py-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                <Input placeholder="you@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </Button>
                        </form>
                    </Form>
                    <div className="relative my-6">
                        <Separator />
                        <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-background px-2 text-xs text-muted-foreground">OR CONTINUE WITH</span>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                        <GoogleIcon />
                        Sign up with Google
                    </Button>
                </div>
            </>
        )
    }

    if (user.status === 'pending') {
        // User with pending application
        return (
            <>
                <DialogHeader className="text-center">
                    <DialogTitle className="font-headline text-2xl">Application Pending</DialogTitle>
                </DialogHeader>
                <div className="py-6 text-center">
                    <Clock className="h-12 w-12 text-accent mx-auto mb-4" />
                    <p className="text-muted-foreground">Your application to become a full member is under review. Thank you for your patience!</p>
                     <DialogClose asChild>
                        <Button className="mt-6">Close</Button>
                    </DialogClose>
                </div>
            </>
        );
    }
    
    if (user.role === 'member' || user.role === 'admin') {
        // Already a full member
        return (
            <>
                <DialogHeader className="text-center">
                    <DialogTitle className="font-headline text-2xl">Welcome Back!</DialogTitle>
                </DialogHeader>
                <div className="py-6 text-center">
                    <CheckCircle className="h-12 w-12 text-accent mx-auto mb-4" />
                    <p className="text-muted-foreground">You are already a member of AURA.</p>
                     <DialogClose asChild>
                        <Button className="mt-6">Close</Button>
                    </DialogClose>
                </div>
            </>
        );
    }

    // Default logged-in user who hasn't applied yet
    return (
      <>
        <DialogHeader className="text-center">
            <DialogTitle className="font-headline text-3xl">Become a Full Member</DialogTitle>
            <DialogDescription>
                Apply now to gain access to exclusive resources, project creation tools, and voting rights in the club.
            </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4">
            <JoinClubForm />
        </div>
      </>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
