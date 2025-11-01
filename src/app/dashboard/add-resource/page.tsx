
"use client";

import { AddResourceDialog } from "@/components/add-resource-dialog";
import { useEffect, useState } from "react";

export default function AddResourcePage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }
    
    return (
        <div className="flex justify-center items-center h-full p-4">
            <AddResourceDialog open={true} setOpen={() => {}} isPage={true}>
                {/* This content is not rendered as the dialog is controlled */}
                <></>
            </AddResourceDialog>
        </div>
    );
}
