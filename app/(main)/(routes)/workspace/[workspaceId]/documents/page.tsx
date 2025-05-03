"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import {api} from "@/convex/_generated/api";
import { toast } from "sonner";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

function DocumentsPage() {
  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const { workspaceId } = useParams() as { workspaceId?: string };

    if (!workspaceId) {
    console.log("waiting for hydration...");
    return null;
    }

  const onCreate = async () => {

    console.log("🚀 onCreate 호출됨");
    if (!workspaceId) {
      console.error("❌ workspaceId is undefined");
      return;
    }
  
    try {
      const promise = create({
        title: "Untitled",
        workspaceId,
      });
  
      toast.promise(promise, {
        loading: "Creating a new note...",
        success: "New note created!",
        error: "Failed to create a new note.",
      });
  
      const documentId = await promise;
      console.log("✅ created docId:", documentId);
  
      router.push(`/workspace/${workspaceId}/documents/${documentId}`);
    } catch (err) {
      console.error("❌ Create failed:", err);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        height={300}
        width={300}
        alt="empty"
        className="dark:hidden"
        priority
      />
      <Image
        src="/empty-dark.png"
        height={300}
        width={300}
        alt="empty"
        className="dark:block hidden"
        priority
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Coope
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="w-4 h-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
}

export default DocumentsPage;