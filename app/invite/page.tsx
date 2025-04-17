'use client';

import { useMutation, useConvexAuth } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/spinner';
import { toast } from 'sonner';
import { SignInButton, useAuth } from '@clerk/nextjs';

export default function InvitePage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { userId } = useAuth(); // Clerk 유저 ID
  const params = useSearchParams();
  const router = useRouter();
  const joinWorkspace = useMutation(api.workspace.joinWorkspace);
  const [loading, setLoading] = useState(true);

  const workspaceId = params.get('workspace');

  useEffect(() => {
    if (!workspaceId) {
      toast.error('워크스페이스 ID가 없습니다.');
      setLoading(false);
      return;
    }

    if (!isLoading && !isAuthenticated) {
      // 로그인 안 되어 있으면 로그인 페이지로 이동 + 현재 URL 유지
      router.push(`/sign-in?redirect_url=/invite?workspace=${workspaceId}`);
      return;
    }

    if (!isLoading && isAuthenticated && workspaceId) {
      const join = async () => {
        try {
          const result = await joinWorkspace({ workspaceId });

          if (result === 'already_member') {
            toast.info('이미 워크스페이스에 참여되어 있어요!');
          } else if (result === 'joined') {
            toast.success('워크스페이스에 참여했어요!');
          }

          router.push(`/workspace/${workspaceId}/documents`);
        } catch (err: any) {
          console.error('초대 실패:', err);
          toast.error(err?.message || '워크스페이스 참여 중 오류가 발생했어요.');
        } finally {
          setLoading(false);
        }
      };

      join();
    }
  }, [isLoading, isAuthenticated, workspaceId, joinWorkspace, router]);

  return (
    <div className="h-full flex items-center justify-center">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <p className="text-sm text-muted-foreground">워크스페이스에 참여 중...</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">처리가 완료되었습니다.</p>
      )}
    </div>
  );
}
