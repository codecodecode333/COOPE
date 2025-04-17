"use client";

import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Spinner } from "@/components/spinner";
import { SignInButton } from "@clerk/clerk-react";
import { Id } from "@/convex/_generated/dataModel";
import { Logo } from "./logo";

export const Heading = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { user } = useUser();
  const createWorkspace = useMutation(api.workspace.createWorkspace);

  const workspaces = useQuery(api.workspace.getMyWorkspaces);

  const handleStart = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const validWorkspaces = (workspaces ?? []).filter(
      (ws): ws is { _id: Id<"workspaces">; name: string; role: string } => ws !== null
    );

    let workspaceId: Id<"workspaces">;

    if (validWorkspaces.length > 0) {
      workspaceId = validWorkspaces[0]._id;
    } else {
      // ✅ userId는 넘기지 않는다!
      workspaceId = await createWorkspace({
        name: `${user.fullName || "내 워크스페이스"}`,
      });
    }

    router.push(`/workspace/${workspaceId}/documents`);
  };

  return (
    <div className="max-w-3xl space-y-4">
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        협업을 새롭게 정의하다
      </h3>
      <Logo />
      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button onClick={handleStart}>
          시작하기
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      )}
      {!isAuthenticated && !isLoading && (
        <SignInButton mode="modal">
          <Button>
            Get Coope free
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};
