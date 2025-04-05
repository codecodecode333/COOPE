"use client";

import { redirect, usePathname } from "next/navigation";
import { Children } from "react";
import { Navigation } from "./_components/navigation"; 
import { Spinner } from "@/components/spinner";
import { useConvexAuth, useQuery } from "convex/react";
import { SearchCommand } from "@/components/search-command";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Toaster } from "sonner";

const MainLayout = ({
    children
} : {
    children: React.ReactNode;
}) => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const currentUrl = usePathname();
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
            {currentUrl !== "/friends" && 
            <Button type="button" className="fixed bottom-10 z-99 right-10 rounded-full"><Ghost /></Button>}
            <Navigation />
            <Toaster />
            <main className="flex-1 h-full overflow-y-auto">
             <SearchCommand/>
             {children}
            </main>
        </div>
    );
}

export default MainLayout;