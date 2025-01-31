"use client";

import React, { useState, useEffect } from "react";
import Loader from "@/components/common/Loader";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

interface ClientWrapperProps {
    children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleComplete = () => setLoading(false);

        // Start loading when the path changes
        handleStart();
        setTimeout(() => handleComplete(), 1000); // Ensure loader is visible for at least 1s

    }, [pathname]);

    return <>{loading ? <Loader /> : children}</>;
}
