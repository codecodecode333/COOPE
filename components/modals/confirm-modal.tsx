'use client'	

import {AlertDialog,AlertDialogAction,AlertDialogCancel
  ,AlertDialogContent,AlertDialogDescription
  ,AlertDialogFooter,AlertDialogHeader,
AlertDialogTitle,AlertDialogTrigger} from '@/components/ui/alert-dialog'
import React from "react"
import { usePathname, useParams, useRouter } from "next/navigation"

interface ConfirmModalProps {
  children:React.ReactNode
  onConfirm:() => void
  documentId: string
  workspaceId: string;
}

export function ConfirmModal ({children,onConfirm,documentId, workspaceId }:ConfirmModalProps) {
  const router = useRouter()
  const pathname = usePathname();

  const handleConfirm = (e:React.MouseEvent<HTMLButtonElement,MouseEvent>) => {
    if (pathname.includes(documentId)) {
      router.push(`/workspace/${workspaceId}/documents`);
    }
    e.stopPropagation()
    onConfirm()
  }
  
return (
    <AlertDialog>
      <AlertDialogTrigger onClick={e => e.stopPropagation()} asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={e => e.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
)
}