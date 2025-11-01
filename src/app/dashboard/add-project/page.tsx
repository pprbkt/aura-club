
"use client";

import { AddProjectDialog } from "@/components/add-project-dialog";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProjectPage() {
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }
    
    return (
        <div className="flex justify-center items-center h-full p-4">
            <AddProjectDialog open={true} setOpen={() => router.push('/dashboard/add')} isPage={true}>
                {/* This content is not rendered as the dialog is controlled */}
                <></>
            </AddProjectDialog>
        </div>
    );
}
