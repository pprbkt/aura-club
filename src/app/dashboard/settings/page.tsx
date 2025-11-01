
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { doodleAvatars } from "@/lib/doodle-avatars";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, User, Palette } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  photoURL: z.string().url("Invalid URL").optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function SettingsPage() {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(user?.photoURL || null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.displayName || "",
      photoURL: user?.photoURL || "",
    },
  });

  useEffect(() => {
    setPreview(user?.photoURL || null);
    form.setValue("photoURL", user?.photoURL || "");
  }, [user, form]);
  
  const selectedPhotoUrl = form.watch('photoURL');
  const isAdmin = user?.role === 'admin';

  async function onSubmit(data: ProfileFormValues) {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await updateUserProfile(data.name, data.photoURL, uploadFile);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setUploadFile(null); // Clear uploaded file after successful submission
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not update your profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleAvatarSelect = (url: string) => {
    form.setValue("photoURL", url, { shouldDirty: true });
    setPreview(url);
    setUploadFile(null); // Clear any uploaded file if an avatar is selected
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        form.setValue("photoURL", result, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
        <h1 className="font-headline text-3xl font-bold flex items-center gap-3"><User />Account Settings</h1>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your public display name.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem className="max-w-md">
                                <FormLabel>Display Name</FormLabel>
                                <FormControl>
                                <Input placeholder="Your Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Profile Picture</CardTitle>
                        <CardDescription>Choose an avatar or upload your own picture.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-shrink-0">
                           <FormLabel>Preview</FormLabel>
                           <Image 
                             src={preview || "https://placehold.co/128x128.png"}
                             alt="Profile preview"
                             data-ai-hint="placeholder"
                             width={128}
                             height={128}
                             className="rounded-full w-32 h-32 object-cover mt-2 border-4 border-primary"
                           />
                        </div>

                        <div className="flex-grow w-full">
                           <Tabs defaultValue="avatars" className="w-full">
                                <TabsList className={cn("grid w-full", isAdmin ? "grid-cols-2" : "grid-cols-1")}>
                                    <TabsTrigger value="avatars"><Palette className="mr-2"/>Choose Avatar</TabsTrigger>
                                    {isAdmin && <TabsTrigger value="upload"><Upload className="mr-2"/>Upload Custom</TabsTrigger>}
                                </TabsList>
                                <TabsContent value="avatars" className="mt-4">
                                     <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
                                        {doodleAvatars.map((url) => (
                                        <button
                                            key={url}
                                            type="button"
                                            onClick={() => handleAvatarSelect(url)}
                                            className={cn(
                                            "rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                            selectedPhotoUrl === url && !uploadFile ? "ring-2 ring-accent ring-offset-2" : ""
                                            )}
                                        >
                                            <Image
                                                src={url}
                                                alt="Doodle avatar"
                                                width={64}
                                                height={64}
                                                className="w-16 h-16 rounded-full hover:scale-110 transition-transform"
                                            />
                                        </button>
                                        ))}
                                    </div>
                                </TabsContent>
                                {isAdmin && (
                                     <TabsContent value="upload" className="mt-4">
                                        <div className="p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center">
                                            <Upload className="h-10 w-10 text-muted-foreground mb-2"/>
                                            <p className="font-semibold mb-2">Upload a custom image</p>
                                            <p className="text-sm text-muted-foreground mb-4">For best results, use a square image.</p>
                                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                                Browse Files
                                            </Button>
                                            <Input
                                                type="file"
                                                className="hidden"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                accept="image/png, image/jpeg, image/gif"
                                            />
                                        </div>
                                     </TabsContent>
                                )}
                           </Tabs>
                        </div>
                    </CardContent>
                </Card>

                 <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
                        {isSubmitting ? "Saving..." : "Save All Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    </div>
  );
}
