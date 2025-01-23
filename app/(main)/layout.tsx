"use client";

import { redirect } from "next/navigation";
import { Children } from "react";
import { Navigation } from "./_components/navigation";
imtport { Spinner } from "@/components/spinner";
imtport { useConvexAuth } from "convex/react";

const MainLayout = ({
    Children
} : {
    Children: React.ReactNode;
}) => {
    const { isAuthenticated, isLoading } = useConvexAuth();

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return redirect("/");
    }

    return (
        <div className="h-full flex dark:bg-[#1F1F1F]">
            <Navigation />
            <main className="flex-1 h-full overflow-y-auto">
             {children}
            </main>
        </div>
    );
}

export default MainLayout;